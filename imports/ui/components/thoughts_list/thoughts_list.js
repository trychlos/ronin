/*
 * 'thoughts_list' component.
 *  Display the specified list of thoughts, giving a cursor (aka an array)
 * 
 *  Parms:
 *  - thoughts: the cursor (aka an array) to be displayed
 *  - editable: whether the items are editable/deletable;
 *      apply to each and every item of the cursor as a whole;
 *      defaults to true
 *  - withDescription: whether to display the description of the thought;
 *      apply to each and every item of the cursor as a whole;
 *      defaults to false.
 * 
 *  NB: this component is used both as a reminder when collecting new thoughts,
 *      and as a dispatcher when processing thoughts.
 */
import { Thoughts } from '/imports/api/collections/thoughts/thoughts.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import './thoughts_list.html';

Template.thoughts_list.fn = {
    pfxUpdate: function(){
        return 'thoughts-list-update-';
    }
};

Template.thoughts_list.helpers({
    topic_byId(id){
        const obj = id ? Topics.findOne({ _id:id }) : null;
        return obj ? obj.name : '';
    },
    hasDescription(d){
        return d === undefined ? false : d;
    },
    isEditable(d){
        return d === undefined ? true : d;
    },
    updateId(o){
        return Template.thoughts_list.fn.pfxUpdate()+o._id;
    },
});

Template.thoughts_list.events({
    'click .js-delete'(event){
        event.preventDefault();
        const target = event.target;        // target=[object SVGSVGElement] but may also be SVGPathElement
        const anchor = miscParent( target, 'a' );
        //console.log( "deleting id='"+anchor.id+"'");
        Meteor.call('thoughts.remove', anchor.id, ( error ) => {
            if( error ){
                return throwError({ message: error.message });
            }
        });
        return false;
    },
    'click .js-update'(event){
        event.preventDefault();
        const target = event.target;        // target=[object SVGSVGElement] but may also be SVGPathElement
        const anchor = miscParent( target, 'a' );
        const id = anchor.id.substring( Template.thoughts_list.fn.pfxUpdate().length );
        var obj = Thoughts.findOne({ _id: id });
        if( !obj ){
            throwError({ message: 'Thought no more exists' });
        } else {
            Session.set( 'setup.thought.obj', obj );
        }
        return false;
    },
});
