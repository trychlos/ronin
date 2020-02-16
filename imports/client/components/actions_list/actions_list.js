/*
 * 'actions_list' component.
 *  Display the specified list of actions, giving a cursor (aka an array)
 *
 *  Parameters:
 *  - actions: the cursor (aka an array) to be displayed
 */
import '/imports/client/components/actions_list_item/actions_list_item.js';
import './actions_list.html';

Template.actions_list.onRendered( function(){
    $.pubsub.subscribe( 'ronin.ui.actions.list.card.collapse-all', function(){
        //console.log( 'component=actions_list subscription=ronin.ui.actions.list.card.collapse-all' );
        $( '.actions-list-item' ).removeClass( 'x-opened' );
        Session.set( 'action.opened', null );
    });
});
