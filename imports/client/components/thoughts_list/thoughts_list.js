/*
 * 'thoughts_list' component.
 *  Display the specified list of thoughts, giving a cursor (aka an array)
 *
 *  Parameters:
 *  - thoughts: the cursor (aka an array) to be displayed
 */
import '/imports/client/components/thoughts_list_item/thoughts_list_item.js';
import './thoughts_list.html';

Template.thoughts_list.events({
    // emitted from thoughts_list_item:
    //  close all items
    'ronin.ui.thoughts.list.card.collapse'( ev, instance ){
        $( '.thoughts-list-item' ).removeClass( 'x-opened' );
        Session.set( 'collect.opened', null );
    }
});
