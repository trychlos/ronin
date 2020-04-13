/*
 * 'plus_button' template.
 *
 *  Display a button on the bottom right of the page.
 *  The positionning is *absolute*.
 *
 * Parameters:
 * - action: maybe:
 *      an Activable action object
 *      a function which returns an Activable action object
 */
import './plus_button.html';

Template.plus_button.helpers({
    // not able to make the 'disabled' Bootstrap button attribute working
    // the jQuery 'ui-state-disabled' blocks events to be catched here, but not to bubble (!)
    //  => so use a dedicated class
    classes(){
        let activable = false;
        if( this.action ){
            const obj = typeof this.action === 'function' ? this.action() : this.action;
            if( obj && obj.activable && typeof obj.activable === 'function' ){
                activable = obj.activable();
            }
        }
        return activable ? '': 'disabled';
    }
});

Template.plus_button.events({
    'click button.js-button'( ev, instance ){
        if( !Meteor.userId()){
            return false;
        }
    }
});
