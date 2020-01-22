/*
 * 'thought_edit' component.
 *  Let the user enter a new thought (session/setup.thought.obj empty)
 *  or edit an existing one (session/setup.thought.obj already exists)/
 *
 *  Session variable:
 *  - setup.thought.obj: the thought being edited.
 */
import { Thoughts } from '/imports/api/collections/thoughts/thoughts.js';
import '/imports/client/components/topics_select/topics_select.js';
import './thought_edit.html';

Template.thought_edit.fn = {
    // initialize the edition area
    // this is needed when we cancel a current creation
    //  as this will not change the setup.thought.obj session variable
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

Template.thought_edit.helpers({
    colSpan(){
        return g.run.mobile ? 1 : 3;
    },
    descriptionPlaceholder(){
        return Session.get('setup.thought.obj') ? '' : 'Description of the new thought';
    },
    descriptionValue(){
        const obj = Session.get('setup.thought.obj');
        return obj ? obj.description : '';
    },
    namePlaceholder(){
        return Session.get('setup.thought.obj') ? '' : 'Type to add new thought';
    },
    nameValue(){
        const obj = Session.get('setup.thought.obj');
        return obj ? obj.name : '';
    },
    submit(){
        return Session.get('setup.thought.obj') ? 'Update' : 'Create';
    },
    title(){
        return Session.get('setup.thought.obj') ? 'Edit thought' : 'New thought';
    },
    topic(){
        const obj = Session.get('setup.thought.obj');
        return obj ? obj.topic : null;
    }
});

Template.thought_edit.events({
    'click .js-cancel'(event){
        event.preventDefault();
        if( !Session.get( 'setup.thought.obj' )){
            Session.set( 'setup.thought.obj', 'x' );  // force re-rendering
        }
        Session.set( 'setup.thought.obj', null );
        Template.thought_edit.fn.initEditArea();
    return false;
    },
   'submit .js-edit'(event, instance){
        event.preventDefault();
        const target = event.target;            // target=[object HTMLFormElement]
        // a name is mandatory
        const name = instance.$('.js-name').val();
        if( name.length ){
            const obj = Session.get( 'setup.thought.obj' );
            const id = obj ? obj._id : null;
            var newobj = {
                name: name,
                description: instance.$('.js-description').val(),
                topic: Template.topics_select.fn.getSelected('')
            };
            try {
                Thoughts.fn.check( id, newobj );
            } catch( e ){
                return throwError({ message: e.message });
            }
            //console.log( 'submit.edit: Thoughts.fn.check() successful' );
            if( obj ){
                // if nothing has changed, then does nothing
                if( Thoughts.fn.equal( obj, newobj )){
                    return false;
                }
                Meteor.call('thoughts.update', id, newobj, ( error ) => {
                    if( error ){
                        return throwError({ message: error.message });
                    }
                });
            } else {
                Meteor.call('thoughts.insert', newobj, ( error ) => {
                    if( error ){
                        return throwError({ message: error.message });
                    }
                });
                Session.set( 'setup.thought.obj', 'x' );  // force re-rendering
            }
            Session.set( 'setup.thought.obj', null );
            Template.thought_edit.fn.initEditArea();
        }
        return false;
    },
});
