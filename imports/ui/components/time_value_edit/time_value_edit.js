/*
 * 'context_edit' component.
 *  Let the user
 *  - enter a new time value (session/setup.time_values.id empty)
 *  - or edit an existing one (session/setup.time_values.id already exists).
 * 
 *  Session variables:
 *  - 'setup.time_values.obj': the edited object, selected in time_values_list.
 */
import { TimeValues } from '/imports/api/collections/time_values/time_values.js';
import './time_value_edit.html';

Template.time_value_edit.fn = {
    // initialize the edition area
    // this is needed when we cancel a current creation
    //  as this will not change the setup.topics.obj session variable
    //  no helper is triggered,
    //  and we have to manually reinit the fields
    initEditArea: function(){
        const instance = Template.instance();
        if( instance.view.isRendered ){
            instance.$('.js-name').val('');
        }
    }
};

Template.time_value_edit.helpers({
    descriptionPlaceholder(){
        return Session.get('setup.time_values.obj') ? '' : 'Description of the new time value';
    },
    descriptionValue(){
        const obj = Session.get('setup.time_values.obj');
        return obj ? obj.description : '';
    },
    namePlaceholder(){
        return Session.get('setup.time_values.obj') ? '' : 'Type to add new time value';
    },
    nameValue(){
        const obj = Session.get('setup.time_values.obj');
        return obj ? obj.name : '';
    },
    submit(){
        return Session.get('setup.time_values.obj') ? 'Update' : 'Create';
    },
    title(){
        return Session.get('setup.time_values.obj') ? 'Edit time value' : 'New time value';
    },
});

Template.time_value_edit.events({
    'click .js-cancel'(event){
        event.preventDefault();
        Session.set( 'setup.time_values.obj', null );
        Template.time_value_edit.fn.initEditArea();
        return false;
    },
   'submit .js-edit'(event, instance){
        event.preventDefault();
        const target = event.target;            // target=[object HTMLFormElement]
        // a name is mandatory
        const name = instance.$('.js-name').val();
        if( name.length ){
            const obj = Session.get( 'setup.time_values.obj' );
            const id = obj ? obj._id : null;
            var newobj = {
                name: name
            };
            try {
                TimeValues.fn.check( id, newobj );
            } catch( e ){
                return throwError({ message: e.message });
            }
            //console.log( 'submit.edit: TimeValues.fn.check() successful' );
            if( obj ){
                // if nothing has changed, then does nothing
                if(( obj.name === newobj.name )){
                    return false;
                }
                Meteor.call('time_values.update', id, newobj, ( error ) => {
                    if( error ){
                        return throwError({ message: error.message });
                    }
                });
            } else {
                Meteor.call('time_values.insert', newobj, ( error ) => {
                    if( error ){
                        return throwError({ message: error.message });
                    }
                });
            }
            //console.log( 'submit.edit: reinitializing Session(setup.time_values.obj)' );
            Session.set( 'setup.time_values.obj', null );
            Template.time_value_edit.fn.initEditArea();
        }
        return false;
    },
});
