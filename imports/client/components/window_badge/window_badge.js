/*
 * 'window_badge' component.
 *
 *  An extension of the 'text_badge' to specifically display in the widget
 *  titlebar in windowLayout.
 *  Display nothing in pageLayout.
 *
 *  Parameters:
 *  - text: the text to be displayed
 *      if empty, 'text_badge' takes care that nothing is displayed at all.
 */
import '/imports/client/components/text_badge/text_badge.js';
import './window_badge.html';

Template.window_badge.helpers({
    // session variable is written when in pageLayout only
    //  in order to be used by the text_badge embedded in header panel
    //  and only displayed when in pageLayout
    writeToSession( text ){
        Session.set( 'text_badge.text', text );
    }
});

Template.window_badge.onDestroyed( function(){
    // as this is only used in pageLayout, we are able to reset the variable
    //  when this instance is destroyed
    Session.set( 'text_badge.text', null );
});
