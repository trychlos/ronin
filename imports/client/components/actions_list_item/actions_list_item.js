/*
 * 'actions_list_item' component.
 *  Display one item of a list of actions, giving a one-element action
 *
 *  Parameters:
 *  - action: the one-item cursor (aka an array) to be displayed
 *
 *  Session variables:
 *  - action.opened: the action identifier whose card is opened
 *      so that we can open the card when coming back from the edition
 */
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/client/components/delete_button/delete_button.js';
import '/imports/client/components/edit_button/edit_button.js';
import '/imports/client/components/ownership_button/ownership_button.js';
import '/imports/client/components/project_button/project_button.js';
import './actions_list_item.html';

Template.actions_list_item.fn = {
    collapsableId : function(){
        return 'collapsable_'+Template.currentData().action._id;
    },
    itemDivId : function(){
        return 'item_div_'+Template.currentData().action._id;
    },
    // parent() identifies a selector which adds Bootstrap accordion-like group
    //  management to a collapsible area;
    //  all collapsible elements under the specified parent will be closed when
    //  this collapsible item is shown
    parent: function(){
        return '.actions-tabs';
    }
}

Template.actions_list_item.onRendered( function(){
    if( Session.get( 'action.opened' ) === this.data.action._id ){
        $( '#'+Template.actions_list_item.fn.collapsableId()).collapse( 'show' );
    }
});

Template.actions_list_item.helpers({
    checked(){
        return this.action.doneDate && moment( this.action.doneDate ).isValid() ? 'checked' : '';
    },
    classCreatedAt( where ){
        const width = g.run.width.get();
        let visible = width <= 480 ? 'x-hidew480' : '';
        if( where === 'card' ){
            visible = width <= 480 ? '' : 'x-hidden';
        }
        return visible;
    },
    className(){
        return $(window).innerWidth() <= 480 ? 'x-w60' : 'w-50';
    },
    classTopic(){
        return $(window).innerWidth() <= 480 ? '' : 'xw-30';
    },
    collapsableId(){
        return Template.actions_list_item.fn.collapsableId();
    },
    itemDivId(){
        return Template.actions_list_item.fn.itemDivId();
    },
    parent(){
        const fn = Template.actions_list_item.fn;
        return fn.parent();
    },
    showDown(){
        return Session.get( 'action.opened' ) === Template.instance().data.action._id ? 'x-hidden' : 'x-inline';
    },
    showUp(){
        return Session.get( 'action.opened' ) === Template.instance().data.action._id ? 'x-inline' : 'x-hidden';
    },
    topic_byId( id ){
        const obj = id ? Topics.findOne({ _id:id }) : null;
        return obj ? obj.name : '';
    }
});

// note that as of Bootstrap v4.4x, sequence of events is:
//  -> show > hide > hidden > shown
// as we want the previous background be erased before setting another one,
// we react on 'hidden' and 'shown' messages
//
Template.actions_list_item.events({
    'click .js-done'( ev, instance ){
        $.pubsub.publish( 'ronin.model.action.done.toggle', { action: instance.data.action });
        return false;
    },
    // event.currentTarget = actions-list-item div
    // event.target = collapsable div
    /*
    'hide.bs.collapse'( ev, instance ){
        console.log( 'hide.bs.collapse' );
        $.pubsub.publish( 'ronin.ui.actions.list.card.collapse-all' );
    },
    */
    // remove all 'x-opened' classes
    'hidden.bs.collapse'( ev, instance ){
        $( ev.target ).trigger( 'ronin-collapse-all' );
    },
    'shown.bs.collapse'( event, instance ){
        $( '#'+Template.actions_list_item.fn.itemDivId()).addClass( 'x-opened' );
        Session.set( 'action.opened', instance.data.action._id );
    }
});
