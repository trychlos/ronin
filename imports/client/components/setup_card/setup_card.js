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
    collapsableId(){
        return Template.setup_card.fn.collapsableId();
    },
    // template helper
    //  attach a 'deleteAction' action to the item, activating it if unused
    deleteAction( it ){
        let action = it.deleteAction || null;
        if( !action ){
            action = new Ronin.ActionEx({
                type: R_OBJ_CONTEXT,
                action: R_ACT_DELETE,
                gtd: 'gtd-setup-context-delete',
                item: it
            });
            it.deleteAction = action;
        }
        action.activable( !Boolean( it.useCount ));
        return action;
    },
    // template helper
    //  attach an 'editAction' action to the item, always activating it
    editAction( it ){
        let action = it.editAction || null;
        if( !action ){
            action = new Ronin.ActionEx({
                type: R_OBJ_CONTEXT,
                action: R_ACT_EDIT,
                gtd: 'gtd-setup-context-edit',
                item: it
            });
            it.editAction = action;
        }
        action.activable( true );
        return action;
    },
    itemDivId(){
        return Template.setup_card.fn.itemDivId();
    },
    log( it ){
        console.log( it );
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
