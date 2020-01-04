/*
 * 'time_values_list' component.
 *  Display the specified list of time values:
 * 
 *  Parms:
 *  - times (mandatory) the cursor (interpreted as an array) to be displayed
 *  - deletable (optional) whether the items are deletable
 *      apply to each and every item of the cursor
 *      defaults to true.
 */
import { TimeValues } from '/imports/api/collections/time_values/time_values.js';
import './time_values_list.html';

Template.time_values_list.fn = {
    pfxDelete: function(){
        return 'delete-';
    },
    pfxUpdate: function(){
        return 'update-';
    }
};

Template.time_values_list.helpers({
    deleteId(o){
        return Template.time_values_list.fn.pfxDelete()+o._id;
    },
    isDeletable( object, deletable_cursor ){
        const dc = deletable_cursor === undefined ? true: deletable_cursor;
        return dc && object.isDeletable();
    },
    updateId(o){
        return Template.time_values_list.fn.pfxUpdate()+o._id;
    },
});

Template.time_values_list.events({
    'click .js-delete'(event){
        event.preventDefault();
        const target = event.target;        // target=[object SVGSVGElement] but may also be SVGPathElement
        const anchor = $( target ).parents( 'a' )[0];
        const id = anchor.id.substring( Template.time_values_list.fn.pfxDelete().length );
        Meteor.call('time_values.remove', id, ( error ) => {
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
        const id = anchor.id.substring( Template.time_values_list.fn.pfxUpdate().length );
        var obj = TimeValues.findOne({ _id: id });
        if( !obj ){
            throwError({ message: 'Time value no more exists' });
        } else {
            Session.set( 'setup.time_values.obj', obj );
        }
        return false;
    },
});
