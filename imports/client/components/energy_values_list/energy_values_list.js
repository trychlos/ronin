/*
 * 'energy_values_list' component.
 *  Display the specified list of energy values.
 * 
 *  Parms:
 *  - energies (mandatory) the cursor (interpreted as an array) to be displayed
 *  - deletable (optional) whether the items are deletable
 *      apply globally to the cursor
 *      defaults to true.
 * 
 *  Session variables:
 *  - 'setup.energy_values_list.obj': the to-be edited object, selected here.
 */
import { EnergyValues } from '/imports/api/collections/energy_values/energy_values.js';
import './energy_values_list.html';

Template.energy_values_list.fn = {
    pfxDelete: function(){
        return 'delete-';
    },
    pfxUpdate: function(){
        return 'update-';
    }
};

Template.energy_values_list.helpers({
    deleteId(o){
        return Template.energy_values_list.fn.pfxDelete()+o._id;
    },
    isDeletable( object, deletable_cursor ){
        const dc = deletable_cursor === undefined ? true: deletable_cursor;
        return dc && object.isDeletable();
    },
    updateId(o){
        return Template.energy_values_list.fn.pfxUpdate()+o._id;
    },
});

Template.energy_values_list.events({
    'click .js-delete'(event){
        event.preventDefault();
        const target = event.target;        // target=[object SVGSVGElement] but may also be SVGPathElement
        const anchor = $( target ).parents( 'a' )[0];
        const id = anchor.id.substring( Template.energy_values_list.fn.pfxDelete().length );
        Meteor.call('energy_values.remove', id, ( error ) => {
            if( error ){
                throwError({ message: error.message });
            }
        });
        return false;
    },
    'click .js-update'(event){
        event.preventDefault();
        const target = event.target;        // target=[object SVGSVGElement] but may also be SVGPathElement
        const anchor = $( target ).parents( 'a' )[0];
        const id = anchor.id.substring( Template.energy_values_list.fn.pfxUpdate().length );
        var obj = EnergyValues.findOne({ _id: id });
        if( !obj ){
            throwError({ message: 'Energy value no more exists' });
        } else {
            Session.set( 'setup.energy_values.obj', obj );
        }
        return false;
    },
});
