/*
 * 'thoughts_list' component.
 *  Display the specified list of thoughts, giving a cursor (aka an array)
 *
 *  Parameters:
 *  - thoughts: the cursor (aka an array) to be displayed
 */
import '/imports/client/components/thoughts_list_item/thoughts_list_item.js';
import './thoughts_list.html';

Template.thoughts_list.onRendered( function(){
    $.pubsub.subscribe( 'ronin.ui.thoughts.list.card.collapse-all', function(){
        //console.log( 'component=thoughts_list subscription=ronin.ui.thoughts.list.card.collapse-all' );
        $( '.thoughts-list-item' ).removeClass( 'x-opened' );
        Session.set( 'collect.opened', null );
    });
});
