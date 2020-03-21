/*
 * 'thought_card' component.
 *  Display one item of a list of thoughts, giving a one-element thought
 *
 *  Parameters:
 *  - thought: the one-item cursor (aka an array) to be displayed
 *  - parent: the parent selector element that Bootstrap requires to close collapsables.
 */
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/client/components/action_button/action_button.js';
import '/imports/client/components/delete_button/delete_button.js';
import '/imports/client/components/edit_button/edit_button.js';
import '/imports/client/components/maybe_button/maybe_button.js';
import '/imports/client/components/ownership_button/ownership_button.js';
import '/imports/client/components/project_button/project_button.js';
import './thought_card.html';

Template.thought_card.fn = {
    collapsableId : function(){
        return 'collapsable_'+Template.currentData().thought._id;
    },
    itemDivId : function(){
        return 'item_div_'+Template.currentData().thought._id;
    }
}

Template.thought_card.onRendered( function(){
    // do we want open the first card on page display ?
    //$( '#'+Template.thought_card.fn.collapsableId()).collapse( 'show' );
});

Template.thought_card.helpers({
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
        return Template.thought_card.fn.collapsableId();
    },
    itemDivId(){
        return Template.thought_card.fn.itemDivId();
    },
    topic_byId( id ){
        const obj = id ? Topics.findOne({ _id:id }) : null;
        return obj ? obj.name : 'None';
    }
});

// note that as of Bootstrap v4.4x, sequence of events is:
//  -> show > hide > hidden > shown
// as we want the previous background be erased before setting another one,
// we react on 'hidden' and 'shown' messages
//
Template.thought_card.events({
    // event.currentTarget = thoughts-list-item div
    // event.target = collapsable div
    'hidden.bs.collapse'( ev, instance ){
        $( ev.target ).trigger( 'ronin-collapse-all' );
    },
    'shown.bs.collapse'( ev, instance ){
        $( '#'+Template.thought_card.fn.itemDivId()).addClass( 'x-opened' );
    }
});
