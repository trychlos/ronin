/*
 * 'window_badge' component.
 *
 *  An extension of the 'text_badge' to specifically display in the widget
 *  titlebar in windowLayout.
 *  Display nothing in pageLayout.
 *
 *  Parameters:
 *  - name: the (local to the window) identifier of the badge
 *  - text: the text to be displayed
 *      if empty, 'text_badge' takes care that nothing is displayed at all.
 */
import '/imports/client/components/text_badge/text_badge.js';
import './window_badge.html';

Template.window_badge.helpers({
    // session variable is used in pageLayout only
    //  in order to be read by the text_badge embedded in header panel
    //  and only displayed when in pageLayout
    toPage( name, text ){
        let hash = Session.get( 'header.badges' );
        hash[name] = text;
        Session.set( 'header.badges', hash );
    }
});
