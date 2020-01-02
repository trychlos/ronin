/*
 * 'priority_value_edit' component.
 *  Let the user
 *  - enter a new priority value (session/setup.priority_values.obj empty)
 *  - or edit an existing one (session/setup.priority_values.obj already exists).
 * 
 *  Session variables:
 *  - 'setup.priority_values.obj': the edited object, selected in priority_values_list.
 */
import { PriorityValues } from '/imports/api/collections/priority_values/priority_values.js';
import './priority_value_edit.html';

Template.priority_value_edit.fn = {
    // initialize the edition area
    // this is needed when we cancel a current creation
    //  as this will not change the setup.topics.obj session variable
    //  no helper is triggered,
    //  and we have to manually reinit the fields
    initEditArea: function(){
        const instance = Template.instance();
        instance.$('.js-name').val('');
        instance.$('.js-calendar').val('');
    }
};

Template.priority_value_edit.onRendered( function(){
    this.$('.js-calendar').spinner({
        icons: { down: 'ui-icon-triangle-1-s', up: 'ui-icon-triangle-1-n' },
        min: 0
    });
});

Template.priority_value_edit.helpers({
    calendarPlaceholder(){
        return '';
    },
    calendarValue(){
        const obj = Session.get('setup.priority_values.obj');
        return obj ? obj.calendar : '';
    },
    descriptionPlaceholder(){
        return Session.get('setup.priority_values.obj') ? '' : 'Description of the new priority value';
    },
    descriptionValue(){
        const obj = Session.get('setup.priority_values.obj');
        return obj ? obj.description : '';
    },
    namePlaceholder(){
        return Session.get('setup.priority_values.obj') ? '' : 'Type to add new priority value';
    },
    nameValue(){
        const obj = Session.get('setup.priority_values.obj');
        return obj ? obj.name : '';
    },
    submit(){
        return Session.get('setup.priority_values.obj') ? 'Update' : 'Create';
    },
    title(){
        return Session.get('setup.priority_values.obj') ? 'Edit priority value' : 'New priority value';
    },
});

Template.priority_value_edit.events({
    'click .js-cancel'(event){
        event.preventDefault();
        Session.set( 'setup.priority_values.obj', null );
        Template.priority_value_edit.fn.initEditArea();
        return false;
    },
   'submit .js-edit'(event, instance){
        event.preventDefault();
        const target = event.target;            // target=[object HTMLFormElement]
        // a name is mandatory
        const name = instance.$('.js-name').val();
        if( name.length ){
            const obj = Session.get( 'setup.priority_values.obj' );
            const id = obj ? obj._id : null;
            var newobj = {
                name: name,
                calendar: instance.$('.js-calendar').val()
            };
            try {
                PriorityValues.fn.check( id, newobj );
            } catch( e ){
                return throwError({ message: e.message });
            }
            //console.log( 'submit.edit: PriorityValues.fn.check() successful' );
            if( obj ){
                // if nothing has changed, then does nothing
                if( PriorityValues.fn.equal( obj, newobj )){
                    return false;
                }
                Meteor.call('priority_values.update', id, newobj, ( error ) => {
                    if( error ){
                        return throwError({ message: error.message });
                    }
                });
            } else {
                Meteor.call('priority_values.insert', newobj, ( error ) => {
                    if( error ){
                        return throwError({ message: error.message });
                    }
                });
            }
            //console.log( 'submit.edit: reinitializing Session(setup.priority_values.obj)' );
            Session.set( 'setup.priority_values.obj', null );
            Template.priority_value_edit.fn.initEditArea();
        }
        return false;
    },
});
