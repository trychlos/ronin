/*
 * 'action_status_edit' component.
 *  Let the user
 *  - enter a new action status (session/setup.action_status.obj empty)
 *  - or edit an existing one (session/setup.action_status.obj already exists).
 *  Session variables:
 *  - 'setup.action_status.obj': the edited object, selected in action_status_list.
 */
import { Meteor } from 'meteor/meteor';
import { ActionStatus } from '/imports/api/collections/action_status/action_status.js';
import './action_status_edit.html';

Template.action_status_edit.fn = {
    // initialize the edition area
    // this is needed when we cancel a current creation
    //  as this will not change the setup.topics.obj session variable
    //  no helper is triggered,
    //  and we have to manually reinit the fields
    initEditArea: function(){
        const instance = Template.instance();
        instance.$('.js-name').val('');
    }
};

Template.action_status_edit.helpers({
    descriptionPlaceholder(){
        return Session.get('setup.action_status.obj') ? '' : 'Description of the new action status';
    },
    descriptionValue(){
        const obj = Session.get('setup.action_status.obj');
        return obj ? obj.description : '';
    },
    namePlaceholder(){
        return Session.get('setup.action_status.obj') ? '' : 'Type to add new action status';
    },
    nameValue(){
        const obj = Session.get('setup.action_status.obj');
        return obj ? obj.name : '';
    },
    submit(){
        return Session.get('setup.action_status.obj') ? 'Update' : 'Create';
    },
    title(){
        return Session.get('setup.action_status.obj') ? 'Edit action status' : 'New action status';
    },
});

Template.action_status_edit.events({
    'click .js-cancel'(event){
        event.preventDefault();
        Session.set( 'setup.action_status.obj', null );
        Template.action_status_edit.fn.initEditArea();
        return false;
    },
   'submit .js-edit'(event, instance){
        event.preventDefault();
        const target = event.target;            // target=[object HTMLFormElement]
        // a name is mandatory
        const name = instance.$('.js-name').val();
        if( name.length ){
            const obj = Session.get( 'setup.action_status.obj' );
            const id = obj ? obj._id : null;
            var newobj = {
                name: name
            };
            try {
                ActionStatus.fn.check( id, newobj );
            } catch( e ){
                return throwError({ message: e.message });
            }
            //console.log( 'submit.edit: ActionStatus.fn.check() successful' );
            if( obj ){
                // if nothing has changed, then does nothing
                if( ActionStatus.fn.equal( obj, newobj )){
                    return false;
                }
                Meteor.call('action_status.update', id, newobj, ( error ) => {
                    if( error ){
                        return throwError({ message: error.message });
                    }
                });
            } else {
                Meteor.call('action_status.insert', newobj, ( error ) => {
                    if( error ){
                        return throwError({ message: error.message });
                    }
                });
            }
            //console.log( 'submit.edit: reinitializing Session(setup.action_status.obj)' );
            Session.set( 'setup.action_status.obj', null );
            Template.action_status_edit.fn.initEditArea();
        }
        return false;
    },
});
