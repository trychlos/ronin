/*
 * 'setup_card' component.
 *
 *  Display one item of the setup collections.
 *
 *  Parameters:
 *  - item: the one-item cursor (aka an array) to be displayed
 *  - parent: the parent selector element that Bootstrap requires to close collapsables
 *  - gtd: the corresponding GTD item.
 */
import '/imports/client/components/delete_button/delete_button.js';
import '/imports/client/components/edit_button/edit_button.js';
import './setup_card.html';

Template.setup_card.fn = {
    collapsableId : function(){
        return 'collapsable_'+Template.currentData().item._id;
    },
    itemDivId : function(){
        return 'item_div_'+Template.currentData().item._id;
    }
}

Template.setup_card.onRendered( function(){
    // do we want open the first card on page display ?
    //$( '#'+Template.setup_card.fn.collapsableId()).collapse( 'show' );
});

Template.setup_card.helpers({
    classCreatedAt( where ){
        const width = g.run.width.get();
        let visible = width <= 480 ? 'x-hidew480' : '';
        if( where === 'card' ){
            visible = width <= 480 ? '' : 'x-hidden';
        }
        return visible;
    },
    className(){
        return g.run.width.get() <= 480 ? 'x-w60' : 'x-w50';
    },
    collapsableId(){
        return Template.setup_card.fn.collapsableId();
    },
    // template helper
    //  activates 'disabled' state if the item is non deletable
    isDeletable( it ){
        return it.useCount ? 'disabled' : '';
    },
    // template helper
    //  activates 'disabled' state if the item is non editable
    isEditable( it ){
        return '';
    },
    itemDivId(){
        return Template.setup_card.fn.itemDivId();
    }
});

// note that as of Bootstrap v4.4x, sequence of events is:
//  -> show > hide > hidden > shown
// as we want the previous background be erased before setting another one,
// we react on 'hidden' and 'shown' messages
//
Template.setup_card.events({
    // remove all 'x-opened' classes
    'hidden.bs.collapse'( ev, instance ){
        $( ev.target ).trigger( 'ronin-collapse-all' );
    },
    'shown.bs.collapse'( event, instance ){
        $( '#'+Template.setup_card.fn.itemDivId()).addClass( 'x-opened' );
    }
});
