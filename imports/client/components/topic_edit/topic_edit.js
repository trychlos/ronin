/*
 * 'topic_edit' component.
 *  Let the user:
 *  - enter a new topic (session/setup.topics.obj empty)
 *  - or edit an existing one (session/setup.topics.obj already exists).
 * 
 * 1. do not update db.textColor nor db.backgroundColor while the
 *    edited record has not been 'updated' (aka submitted)
 *      until that, color changes only affect the edition area.
 * 
 * 2. after insert/update, the edition area has to cleared.
 * 
 *  Session variables:
 *  - 'setup.topics.obj': the edited object, selected in topics_list.
 */
import { Topics } from '/imports/api/collections/topics/topics.js';
import './topic_edit.html';

Template.topic_edit.fn = {
    // jQuery objects
    objName: null,
    objDescription: null,
    objTextColor: null,
    objBackgroundColor: null,
    // initialize the edition area
    // this is needed when we cancel a current creation
    //  as this will not change the setup.topics.obj session variable
    //  no helper is triggered,
    //  and we have to manually reinit the fields
    initEditArea: function(){
        const instance = Template.instance();
        if( instance.view.isRendered ){
            Template.topic_edit.fn.setDefaultTextColor();
            Template.topic_edit.fn.setDefaultBackgroundColor();
            Template.topic_edit.fn.objName.val('');
            Template.topic_edit.fn.objDescription.val('');
        }
    },
    // defaults values for the edition area
    setDefaultTextColor: function(){
        Template.topic_edit.fn.objTextColor.spectrum("set",'black');
        Template.topic_edit.fn.setEditTextColor( 'black' );
    },
    setDefaultBackgroundColor: function(){
        Template.topic_edit.fn.objBackgroundColor.spectrum("set",'white');
        Template.topic_edit.fn.setEditBackgroundColor( 'white' );
    },
    // after a color change, set the text color of the edition area
    setEditTextColor: function( color ){
        Template.topic_edit.fn.objName.css({ 'color':color });
    },
    // after a color change, set the background color of the edition area
    setEditBackgroundColor: function( color ){
        const instance = Template.instance();
        Template.topic_edit.fn.objName.css({ 'background-color':color });
    }
};

Template.topic_edit.onRendered( function(){
    Template.topic_edit.fn.objName = this.$('.js-name');
    Template.topic_edit.fn.objDescription = this.$('.js-description');
    Template.topic_edit.fn.objTextColor = this.$('.js-textcolor');
    Template.topic_edit.fn.objBackgroundColor = this.$('.js-backcolor');
    // initialize text color selection
    // during an update (the session holds a topic object), all the UI
    //  will be dynamically updated
    // contrarily, when entering a new topic, we have to update the UI ourselves
    var obj;
    obj = miscSpectrum();
    obj.change = function(){
        Template.topic_edit.fn.setEditTextColor(
            Template.topic_edit.fn.objTextColor.spectrum("get").toHexString());
    };
    Template.topic_edit.fn.objTextColor.spectrum( obj );
    Template.topic_edit.fn.setDefaultTextColor();
    // initialize background color selection
    obj = miscSpectrum();
    obj.change = function(){
        Template.topic_edit.fn.setEditBackgroundColor(
            Template.topic_edit.fn.objBackgroundColor.spectrum("get").toHexString());
    };
    Template.topic_edit.fn.objBackgroundColor.spectrum( obj );
    Template.topic_edit.fn.setDefaultBackgroundColor();
});
  
Template.topic_edit.helpers({
    backgroundColor(){
        let color = null;
        const instance = Template.instance();
        if( instance.view.isRendered ){
            const obj = Session.get('setup.topics.obj');
            const elt = Template.topic_edit.fn.objBackgroundColor;
            color = obj && obj.backgroundColor ? obj.backgroundColor : elt.spectrum('get');
            elt.spectrum("set",color);
        }
        return color;
    },
    descriptionPlaceholder(){
        return Session.get('setup.topics.obj') ? '' : 'Description of the new topic';
    },
    descriptionValue(){
        const obj = Session.get('setup.topics.obj');
        return obj ? obj.description : '';
    },
    namePlaceholder(){
        return Session.get('setup.topics.obj') ? '' : 'Type to add new topic';
    },
    nameValue(){
        const obj = Session.get('setup.topics.obj');
        return obj ? obj.name : '';
    },
    submit(){
        return Session.get('setup.topics.obj') ? 'Update' : 'Create';
    },
    textColor(){
        let color = null;
        const instance = Template.instance();
        if( instance.view.isRendered ){
            const obj = Session.get('setup.topics.obj');
            const elt = Template.topic_edit.fn.objTextColor;
            color = obj && obj.textColor ? obj.textColor : elt.spectrum('get');
            elt.spectrum("set",color);
        }
        return color;
    },
    title(){
        return Session.get('setup.topics.obj') ? 'Edit topic' : 'New topic';
    },
});

Template.topic_edit.events({
    'click .js-cancel'(event){
        event.preventDefault();
        if( !Session.get( 'setup.topics.obj' )){
            Session.set( 'setup.topics.obj', 'x' );  // force re-rendering
        }
        Session.set( 'setup.topics.obj', null );
        Template.topic_edit.fn.initEditArea();
    return false;
    },
   'submit .js-edit'(event,instance){
        event.preventDefault();
        //const target = event.target;            // target=[object HTMLFormElement]
        // a name is mandatory
        const name = Template.topic_edit.fn.objName.val();
        if( name.length ){
            const obj = Session.get( 'setup.topics.obj' );
            const id = obj ? obj._id : null;
            var newobj = {
                name: name,
                description: Template.topic_edit.fn.objDescription.val(),
                textColor: Template.topic_edit.fn.objTextColor.spectrum("get").toHexString(),
                backgroundColor: Template.topic_edit.fn.objBackgroundColor.spectrum("get").toHexString()
            };
            try {
                Topics.fn.check( id, newobj );
            } catch( e ){
                return throwError({ message: e.message });
            }
            //console.log( 'submit.edit: Topics.fn.check() successful' );
            if( obj ){
                // if nothing has changed, then does nothing
                if( Topics.fn.equal( obj, newobj )){
                        return false;
                }
                Meteor.call('topics.update', id, newobj, ( error ) => {
                    if( error ){
                        return throwError({ message: error.message });
                    }
                });
            } else {
                Meteor.call('topics.insert', newobj, ( error ) => {
                    if( error ){
                        return throwError({ message: error.message });
                    }
                });
                Session.set( 'setup.topics.obj', 'x' );  // force re-rendering
            }
            Session.set( 'setup.topics.obj', null );
            Template.topic_edit.fn.initEditArea();
        }
        return false;
    }
});
