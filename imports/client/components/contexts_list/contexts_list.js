/*
 * 'contexts_list' component.
 *  Display the specified list of contexts:
 *  Parms:
 *  - contexts (mandatory) the cursor (interpreted as an array) to be displayed
 *  - deletable (optional) whether the items are deletable
 *      apply globally to the cursor
 *      defaults to true.
 *  Session variables:
 *  - 'setup.contexts.obj': the to-be edited object, selected here.
 */
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import './contexts_list.html';

Template.contexts_list.fn = {
    pfxDelete: function(){
        return 'delete-';
    },
    pfxUpdate: function(){
        return 'update-';
    }
};

Template.contexts_list.helpers({
    deleteId(o){
        return Template.contexts_list.fn.pfxDelete()+o._id;
    },
    isDeletable( object, deletable_cursor ){
        const dc = deletable_cursor === undefined ? true: deletable_cursor;
        return dc && object.isDeletable();
    },
    updateId(o){
        return Template.contexts_list.fn.pfxUpdate()+o._id;
    },
});

Template.contexts_list.events({
    'click .js-delete'(event){
        event.preventDefault();
        const target = event.target;        // target=[object SVGSVGElement] but may also be SVGPathElement
        const anchor = $( target ).parents( 'a' )[0];
        const id = anchor.id.substring( Template.contexts_list.fn.pfxDelete().length );
        Meteor.call('contexts.remove', id, ( error ) => {
            if( error ){
                messageError({ message: error.message });
            }
        });
        return false;
    },
    'click .js-update'(event){
        event.preventDefault();
        const target = event.target;        // target=[object SVGSVGElement] but may also be SVGPathElement
        const anchor = $( target ).parents( 'a' )[0];
        const id = anchor.id.substring( Template.contexts_list.fn.pfxUpdate().length );
        var obj = Contexts.findOne({ _id: id });
        if( !obj ){
            messageError({ message: 'Context no more exists' });
        } else {
            Session.set( 'setup.contexts.obj', obj );
        }
        return false;
    },
});
