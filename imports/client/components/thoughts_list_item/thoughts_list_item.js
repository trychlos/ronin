/*
 * 'thoughts_list_item' component.
 *  Display one item of a list of thoughts, giving a one-element thought
 *
 *  Parameters:
 *  - thought: the one-item cursor (aka an array) to be displayed
 *
 *  Session variables:
 *  - collect.opened: the thought identifier whose card is opened
 *      so that we can open the card when coming back from the edition
 */
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/client/components/thoughts_list_card/thoughts_list_card.js';
import './thoughts_list_item.html';

Template.thoughts_list_item.fn = {
    collapsableId : function(){
        return 'collapsable_'+Template.currentData().thought._id;
    },
    itemDivId : function(){
        return 'item_div_'+Template.currentData().thought._id;
    }
}

Template.thoughts_list_item.onRendered( function(){
    if( Session.get( 'collect.opened' ) === this.data.thought._id ){
        $( '#'+Template.thoughts_list_item.fn.collapsableId()).collapse( 'show' );
    }
});

Template.thoughts_list_item.helpers({
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
        return Template.thoughts_list_item.fn.collapsableId();
    },
    itemDivId(){
        return Template.thoughts_list_item.fn.itemDivId();
    },
    showDown(){
        return Session.get( 'collect.opened' ) === Template.instance().data.thought._id ? 'x-hidden' : 'x-inline';
    },
    showUp(){
        return Session.get( 'collect.opened' ) === Template.instance().data.thought._id ? 'x-inline' : 'x-hidden';
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
Template.thoughts_list_item.events({
    // event.currentTarget = thoughts-list-item div
    // event.target = collapsable div
    'hide.bs.collapse'( ev, instance ){
        $.pubsub.publish( 'ronin.ui.thoughts.list.card.collapse-all' );
    },
    'shown.bs.collapse'( ev, instance ){
        $( '#'+Template.thoughts_list_item.fn.itemDivId()).addClass( 'x-opened' );
        Session.set( 'collect.opened', instance.data.thought._id );
    }
});
