/*
 * 'collapse_buttons' component.
 *
 *  Contains:
 *  - a 'collapse' button
 *  - a 'X' button to cancel
 *  - a 'OK' button
 *     +--------------------------------------+
 *     | [Collapse] [X]                  [OK] |
 *     +--------------------------------------+
 *
 *  If the div is actually collapsed, only 'toggle collapse' action is permitted.
 *  Buttons are not displayed.
 *
 *  Parameters:
 *  - 'collapsableSelector': a CSS selector as a string which identifies the part to
 *      be collapsed.
 *  - 'collapsedLabel': a text to be displayed when collapsed.
 *  - 'cancelLabel': a text to be displayed in place of the 'X' on the Cancel button.
 *  - 'okLabel': a text to be displayed in place of the 'OK' on the OK button.
 */
import './collapse_buttons.html';

Template.collapse_buttons.onCreated( function(){
    this.collapsed = new ReactiveVar( false );
});

Template.collapse_buttons.onRendered( function(){
    this.autorun(() => {
        if( this.data.collapsableSelector ){
            $( this.data.collapsableSelector ).collapse( this.collapsed.get() ? 'hide' : 'show' );
        }
    })
});

Template.collapse_buttons.helpers({
    // class helper: whether the 'down' button should be visible
    showDown(){
        return Template.instance().collapsed.get() ? 'x-inline' : 'x-hidden';
    },
    // class helper: whether the 'up' button should be visible
    showUp(){
        return Template.instance().collapsed.get() ? 'x-hidden' : '';
    },
});

Template.collapse_buttons.events({
    'click .js-collapse'( ev, instance ){
        const collapsed = instance.collapsed.get();
        instance.collapsed.set( !collapsed );
    }
});