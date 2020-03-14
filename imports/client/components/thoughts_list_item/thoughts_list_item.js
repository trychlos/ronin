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
import '/imports/client/components/action_button/action_button.js';
import '/imports/client/components/delete_button/delete_button.js';
import '/imports/client/components/edit_button/edit_button.js';
import '/imports/client/components/maybe_button/maybe_button.js';
import '/imports/client/components/ownership_button/ownership_button.js';
import '/imports/client/components/project_button/project_button.js';
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
    //console.log( this );
    if( Session.get( 'collect.opened' ) === this.data.thought._id ){
        $( '#'+Template.thoughts_list_item.fn.collapsableId()).collapse( 'show' );
    }
});

Template.thoughts_list_item.helpers({
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

// note that as of Bootstrap v4.4x, sequence of events is:
//  -> show > hide > hidden > shown
// as we want the previous background be erased before setting another one,
// we react on 'hidden' and 'shown' messages
//
Template.thoughts_list_item.events({
    // event.currentTarget = thoughts-list-item div
    // event.target = collapsable div
    'hidden.bs.collapse'( ev, instance ){
        $( ev.target ).trigger( 'ronin-collapse-all' );
    },
    'shown.bs.collapse'( ev, instance ){
        $( '#'+Template.thoughts_list_item.fn.itemDivId()).addClass( 'x-opened' );
        Session.set( 'collect.opened', instance.data.thought._id );
    }
});
