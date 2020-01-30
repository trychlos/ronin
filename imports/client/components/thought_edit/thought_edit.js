/*
 * 'thought_edit' component.
 *  Let the user enter a new thought (session/collect.thought empty)
 *  or edit an existing one (session/collect.thought already exists)/
 *
 *  Session variable:
 *  - collect.thought: the thought being edited.
 *
 *  Parameters:
 *  - collapsable=true|false whether this component may be collapsed
 *      defaulting to false.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import '/imports/client/components/topics_select/topics_select.js';
import './thought_edit.html';

Template.thought_edit.fn = {
    // provides a unique id for the collapsable part
    collapsableId: function(){
        return '98e84c99-d2f3-4c54-96a3-b4d6ccf8b3f0';
    },
    // initialize the edition area
    // this is needed when we cancel a current creation
    //  as this will not change the collect.thought session variable
    //  no helper is triggered,
    //  and we have to manually reinit the fields
    initEditArea: function(){
        const instance = Template.instance();
        if( instance.view.isRendered ){
            instance.$('.js-name').val('');
            instance.$('.js-description').val('');
            Template.topics_select.fn.selectDefault();
        }
    }
};

Template.thought_edit.onCreated( function(){
    this.collapsed = new ReactiveVar( false );
});

Template.thought_edit.onRendered( function(){
    this.autorun(() => {
        $('#'+Template.thought_edit.fn.collapsableId()).collapse( this.collapsed.get() ? 'hide' : 'show' );
    });
});

Template.thought_edit.helpers({
    // provides a unique id for the collapsable part
    collapsableId(){
        return Template.thought_edit.fn.collapsableId();
    },
    colSpan(){
        return g.run.mobile ? 1 : 3;
    },
    descriptionPlaceholder(){
        return Session.get( 'collect.thought' ) ? '' : 'Description of the new thought';
    },
    descriptionValue(){
        const obj = Session.get( 'collect.thought' );
        return obj ? obj.description : '';
    },
    namePlaceholder(){
        return Session.get( 'collect.thought' ) ? '' : 'Type to add new thought';
    },
    nameValue(){
        const obj = Session.get( 'collect.thought' );
        return obj ? obj.name : '';
    },
    // html helper: count of rows to be displayed for description field
    rowsCount(){
        return 4; //g.run.layout.get() === 'LYT_WINDOW' ? 4 : 2;
    },
    // class helper: whether the 'down' button should be visible
    showDown(){
        return Template.instance().collapsed.get() ? 'x-inline' : 'x-hidden';
    },
    // class helper: whether the 'up' button should be visible
    showUp(){
        return Template.instance().collapsed.get() ? 'x-hidden' : '';
    },
    submit(){
        return Session.get( 'collect.thought' ) ? 'Update' : 'Create';
    },
    title(){
        const title = Session.get( 'collect.thought' ) ? 'Edit thought' : 'New thought';
        Session.set( 'header.title', title );
        return title;
    },
    topic(){
        const obj = Session.get( 'collect.thought' );
        return obj ? obj.topic : null;
    }
});

Template.thought_edit.events({
    'click .js-collapse'( event, instance ){
        const collapsed = instance.collapsed.get();
        instance.collapsed.set( !collapsed );
    },
    'click .js-cancel'(event){
        Session.set( 'collect.thought', null );
        Session.set( 'header.title', null );
        FlowRouter.go( 'collect' );
        return false;
    },
   'submit .js-edit'(event, instance){
        //event.preventDefault();
        const target = event.target;            // target=[object HTMLFormElement]
        // a name is mandatory
        const name = instance.$('.js-name').val();
        const obj = Session.get( 'collect.thought' );
        const id = obj ? obj._id : null;
        var newobj = {
            type: 'T',
            name: name,
            description: instance.$('.js-description').val(),
            topic: Template.topics_select.fn.getSelected('')
        };
        try {
            Articles.fn.check( id, newobj );
        } catch( e ){
            throwError({ type:e.error, message: e.reason });
            return false;
        }
        if( obj ){
            // if nothing has changed, then does nothing
            if( Articles.fn.equal( obj, newobj )){
                return false;
            }
            Meteor.call('thoughts.update', id, newobj, ( e, result ) => {
                if( e ){
                    throwError({ type:e.error, message: e.reason });
                    return false;
                }
                throwSuccess( 'Thought successfully updated' );
            });
        } else {
            Meteor.call('thoughts.insert', newobj, ( e, result ) => {
                if( e ){
                    throwError({ type:e.error, message: e.reason });
                    return false;
                }
                throwSuccess( 'Thought successfully inserted' );
            });
            Session.set( 'collect.thought', 'x' );  // force re-rendering
        }
        Session.set( 'collect.thought', null );
        if( obj ){
            Session.set( 'header.title', null );
            FlowRouter.go( 'collect' );
            return false;
        }
        Template.thought_edit.fn.initEditArea();
        return false;
    }
});
