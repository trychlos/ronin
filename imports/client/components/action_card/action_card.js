/*
 * 'action_card' component.
 *  Display one action.
 *
 *  Parameters:
 *  - action: the one-item cursor (aka an array) to be displayed
 *  - parent: the parent selector element that Bootstrap requires to close collapsables.
 */
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/client/components/delete_button/delete_button.js';
import '/imports/client/components/edit_button/edit_button.js';
import '/imports/client/components/ownership_button/ownership_button.js';
import '/imports/client/components/project_button/project_button.js';
import './action_card.html';

Template.action_card.fn = {
    collapsableId : function(){
        return 'collapsable_'+Template.currentData().action._id;
    },
    itemDivId : function(){
        return 'item_div_'+Template.currentData().action._id;
    }
}

Template.action_card.onRendered( function(){
    // do we want open the first card on page display ?
    //$( '#'+Template.action_card.fn.collapsableId()).collapse( 'show' );
});

Template.action_card.helpers({
    checked(){
        return this.action.doneDate && moment( this.action.doneDate ).isValid() ? 'checked' : '';
    },
    classCreatedAt( where ){
        const width = Ronin.ui.runWidth();
        let visible = width <= 480 ? 'x-hidew480' : '';
        if( where === 'card' ){
            visible = width <= 480 ? '' : 'x-hidden';
        }
        return visible;
    },
    className(){
        return Ronin.ui.runWidth() <= 480 ? 'x-w60' : 'x-w50';
    },
    classTopic(){
        return Ronin.ui.runWidth() <= 480 ? '' : 'x-w30';
    },
    collapsableId(){
        return Template.action_card.fn.collapsableId();
    },
    doneClass(){
        return this.action.doneDate && moment( this.action.doneDate ).isValid() ? 'x-through' : '';
    },
    itemDivId(){
        return Template.action_card.fn.itemDivId();
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
Template.action_card.events({
    'click .js-done'( ev, instance ){
        $.pubsub.publish( 'ronin.model.action.done.toggle', { action: instance.data.action });
        return false;
    },
    // remove all 'x-opened' classes
    'hidden.bs.collapse'( ev, instance ){
        $( ev.target ).trigger( 'ronin-collapse-all' );
    },
    'shown.bs.collapse'( event, instance ){
        $( '#'+Template.action_card.fn.itemDivId()).addClass( 'x-opened' );
    }
});
