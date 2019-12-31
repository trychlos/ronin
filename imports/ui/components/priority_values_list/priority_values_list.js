/*
 * 'priority_values_list' component.
 *  Display the specified list of priority values:
 * 
 *  Parms:
 *  - priorities (mandatory) the cursor (interpreted as an array) to be displayed
 *  - deletable (optional) whether the items are deletable
 *      apply globally to the cursor
 *      defaults to true.
 * 
 *  Session variables:
 *  - 'setup.priority_values.obj': the to-be edited object, selected here.
 */
import { Meteor } from 'meteor/meteor';
import { PriorityValues } from '/imports/api/collections/priority_values/priority_values.js';
import './priority_values_list.html';

Template.priority_values_list.fn = {
    pfxDelete: function(){
        return 'delete-';
    },
    pfxUpdate: function(){
        return 'update-';
    }
};

Template.priority_values_list.helpers({
    deleteId(o){
        return Template.priority_values_list.fn.pfxDelete()+o._id;
    },
    isDeletable( object, deletable_cursor ){
        const dc = deletable_cursor === undefined ? true: deletable_cursor;
        return dc && object.isDeletable();
    },
    updateId(o){
        return Template.priority_values_list.fn.pfxUpdate()+o._id;
    },
});

Template.priority_values_list.events({
    'click .js-delete'(event){
        event.preventDefault();
        const target = event.target;        // target=[object SVGSVGElement] but may also be SVGPathElement
        const anchor = miscParent( target, 'a' );
        const id = anchor.id.substring( Template.priority_values_list.fn.pfxDelete().length );
        Meteor.call('priority_values.remove', id, ( error ) => {
            if( error ){
                throwError({ message: error.message });
            }
        });
        return false;
    },
    'click .js-update'(event){
        event.preventDefault();
        const target = event.target;        // target=[object SVGSVGElement] but may also be SVGPathElement
        const anchor = miscParent( target, 'a' );
        const id = anchor.id.substring( Template.priority_values_list.fn.pfxUpdate().length );
        var obj = PriorityValues.findOne({ _id: id });
        if( !obj ){
            throwError({ message: 'Priority value no more exists' });
        } else {
            Session.set( 'setup.priority_values.obj', obj );
        }
        return false;
    },
});
