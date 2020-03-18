/*
 * 'energy_value_edit' component.
 *  Let the user
 *  - enter a new energy value (session/setup.energy_values.obj empty)
 *  - or edit an existing one (session/setup.energy_values.obj already exists).
 * 
 *  Session variables:
 *  - 'setup.energy_values.obj': the edited object, selected in energy_values_list.
 */
import { EnergyValues } from '/imports/api/collections/energy_values/energy_values.js';
import './energy_value_edit.html';

Template.energy_value_edit.fn = {
    // initialize the edition area
    // this is needed when we cancel a current creation
    //  as this will not change the setup.topics.obj session variable
    //  no helper is triggered,
    //  and we have to manually reinit the fields
    initEditArea: function(){
        const instance = Template.instance();
        if( instance.view.isRendered ){
            $('.js-name').val('');
        }
    }
};

Template.energy_value_edit.helpers({
    descriptionPlaceholder(){
        return Session.get('setup.energy_values.obj') ? '' : 'Description of the new energy value';
    },
    descriptionValue(){
        const obj = Session.get('setup.energy_values.obj');
        return obj ? obj.description : '';
    },
    namePlaceholder(){
        return Session.get('setup.energy_values.obj') ? '' : 'Type to add new energy value';
    },
    nameValue(){
        const obj = Session.get('setup.energy_values.obj');
        return obj ? obj.name : '';
    },
    submit(){
        return Session.get('setup.energy_values.obj') ? 'Update' : 'Create';
    },
    title(){
        return Session.get('setup.energy_values.obj') ? 'Edit energy value' : 'New energy value';
    },
});

Template.energy_value_edit.events({
    'click .js-cancel'(event){
        event.preventDefault();
        Session.set( 'setup.energy_values.obj', null );
        Template.energy_value_edit.fn.initEditArea();
        return false;
    },
   'submit .js-edit'(event, instance){
        event.preventDefault();
        const target = event.target;            // target=[object HTMLFormElement]
        // a name is mandatory
        const name = instance.$('.js-name').val();
        if( name.length ){
            const obj = Session.get( 'setup.energy_values.obj' );
            const id = obj ? obj._id : null;
            var newobj = {
                name: name
            };
            try {
                EnergyValues.fn.check( id, newobj );
            } catch( e ){
                return messageError({ message: e.message });
            }
            //console.log( 'submit.edit: EnergyValues.fn.check() successful' );
            if( obj ){
                // if nothing has changed, then does nothing
                if( EnergyValues.fn.equal( obj, newobj )){
                    return false;
                }
                Meteor.call('energy_values.update', id, newobj, ( error ) => {
                    if( error ){
                        return messageError({ message: error.message });
                    }
                });
            } else {
                Meteor.call('energy_values.insert', newobj, ( error ) => {
                    if( error ){
                        return messageError({ message: error.message });
                    }
                });
            }
            //console.log( 'submit.edit: reinitializing Session(setup.energy_values.obj)' );
            Session.set( 'setup.energy_values.obj', null );
            Template.energy_value_edit.fn.initEditArea();
        }
        return false;
    },
});
