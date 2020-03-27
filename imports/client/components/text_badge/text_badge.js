/*
 * 'text_badge' component.
 *
 *  Display the specified text (usually a count) as a badge.
 *
 *  In windowLayout, i.e. when the window is displayed through the IWindowed
 *  interface, the interface takes itself care of moving the 'ronin-iwm-titlebadge'
 *  to the widget titlebar.
 *
 *  Parameters:
 *  - text: the text to be displayed
 *      if empty, nothing is displayed at all (not even the rounded borders).
 */
import './text_badge.html';

Template.text_badge.helpers({
    // class helper
    //  nothing at all is displayed if text is not defined
    visibleClass(){
        if( this.text === 0 ){
            return '';
        }
        return this.text ? '' : 'x-hidden';
    }
});
