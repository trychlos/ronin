/*
 * 'actions_list_item' component.
 *  Display one item of a list of actions, giving a one-element action
 *
 *  Parameters:
 *  - action: the one-item cursor (aka an array) to be displayed
 *
 *  Session variables:
 *  - review.action: the action object to be edited
 *  - action.opened: the action identifier whose card is opened
 *      so that we can open the card when coming back from the edition
 */
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/client/components/actions_list_card/actions_list_card.js';
import './actions_list_item.html';

Template.actions_list_item.fn = {
    collapsableId : function(){
        return 'collapsable_'+Template.currentData().action._id;
    },
    itemDivId : function(){
        return 'item_div_'+Template.currentData().action._id;
    }
}

Template.actions_list_item.onRendered( function(){
    if( Session.get( 'action.opened' ) === this.data.action._id ){
        $( '#'+Template.actions_list_item.fn.collapsableId()).collapse( 'show' );
    }
});

Template.actions_list_item.helpers({
    classCreatedAt(){
        return $(window).innerWidth() <= 480 ? 'x-hidew480' : '';
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

// note that as of Bootstrap v4.4x, 'show' event is triggered *before* the 'hide' event
//  though 'show' event is asynchronous, thus less reliable, at least is it triggered
//  after the 'hide' due to the transition delay...
//
Template.actions_list_item.events({
    // event.currentTarget = actions-list-item div
    // event.target = collapsable div
    'hide.bs.collapse'( ev, instance ){
        $.pubsub.publish( 'ronin.ui.actions.list.card.collapse-all' );
    },
    'shown.bs.collapse'( event, instance ){
        $( '#'+Template.actions_list_item.fn.itemDivId()).addClass( 'x-opened' );
        Session.set( 'action.opened', instance.data.action._id );
    }
});
