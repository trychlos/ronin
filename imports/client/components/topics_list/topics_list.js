/*
 * 'topics_list' component.
 *  Display the specified list of topics:
 * 
 *  Parms:
 *  - topics (mandatory) the cursor (interpreted as an array) to be displayed
 *  - deletable (optional) whether the items are deletable
 *      apply to each and every item of the cursor
 *      defaults to true.
 */
import { Topics } from '/imports/api/collections/topics/topics.js';
import './topics_list.html';

Template.topics_list.fn = {
    pfxDelete: function(){
        return 'topics-list-delete-';
    },
    pfxTr: function(){
        return 'topics-list-tr-';
    },
    pfxUpdate: function(){
        return 'topics-list-update-';
    }
};

Template.topics_list.helpers({
    backgroundColor(o){
       return o.backgroundColor ? o.backgroundColor : 'inherit';
    },
    deleteId(o){
        return Template.topics_list.fn.pfxDelete()+o._id;
    },
    isDeletable( object, deletable_cursor ){
        const dc = deletable_cursor === undefined ? true: deletable_cursor;
        return dc && object.isDeletable();
    },
    textColor(o){
       return o.textColor ? o.textColor : 'inherit';
    },
    trId(o){
        return Template.topics_list.fn.pfxTr()+o._id;
    },
    updateId(o){
        return Template.topics_list.fn.pfxUpdate()+o._id;
    },
});

Template.topics_list.events({
    'click .js-delete'(event){
        event.preventDefault();
        const target = event.target;        // target=[object SVGSVGElement] but may also be SVGPathElement
        const anchor = $( target ).parents( 'a' )[0];
        const id = anchor.id.substring( Template.topics_list.fn.pfxDelete().length );
        Meteor.call('topics.remove', id, ( error ) => {
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
        const id = anchor.id.substring( Template.topics_list.fn.pfxUpdate().length );
        var obj = Topics.findOne({ _id: id });
        if( !obj ){
            throwError({ message: 'Topic no more exists' });
        } else {
            Session.set( 'setup.topics.obj', obj );
        }
        return false;
    },
});
