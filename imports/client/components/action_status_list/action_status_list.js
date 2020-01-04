/*
 * 'action_status_list' component.
 *  Display the specified list of action status:
 * 
 *  Parms:
 *  - status (mandatory) the cursor (interpreted as an array) to be displayed
 *  - deletable (optional) whether the items are deletable
 *      apply globally to the cursor
 *      defaults to true.
 * 
 *  Session variables:
 *  - 'setup.action_status.obj': the to-be edited object, selected here.
 */
import { ActionStatus } from '/imports/api/collections/action_status/action_status.js';
import './action_status_list.html';

Template.action_status_list.fn = {
    pfxDelete: function(){
        return 'delete-';
    },
    pfxUpdate: function(){
        return 'update-';
    }
};

Template.action_status_list.helpers({
    deleteId(o){
        return Template.action_status_list.fn.pfxDelete()+o._id;
    },
    isDeletable( object, deletable_cursor ){
        const dc = deletable_cursor === undefined ? true: deletable_cursor;
        return dc && object.isDeletable();
    },
    updateId(o){
        return Template.action_status_list.fn.pfxUpdate()+o._id;
    },
});

Template.action_status_list.events({
    'click .js-delete'(event){
        event.preventDefault();
        const target = event.target;        // target=[object SVGSVGElement] but may also be SVGPathElement
        const anchor = $( target ).parents( 'a' )[0];
        const id = anchor.id.substring( Template.action_status_list.fn.pfxDelete().length );
        Meteor.call('action_status.remove', id, ( error ) => {
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
        const id = anchor.id.substring( Template.action_status_list.fn.pfxUpdate().length );
        var obj = ActionStatus.findOne({ _id: id });
        if( !obj ){
            throwError({ message: 'Action status no more exists' });
        } else {
            Session.set( 'setup.action_status.obj', obj );
        }
        return false;
    },
});
