/*
 * 'plus_button' template.
 *
 *  Display a button on the bottom right of the page.
 *  The positionning is *absolute*.
 */
import './plus_button.html';

Template.plus_button.helpers({
    // not able to make the 'disabled' Bootstrap button attribute working
    // the jQuery 'ui-state-disabled' blocks events to be catched here, but not to bubble (!)
    //  => so use a dedicated class
    disabledClass(){
        return Meteor.userId() ? '': 'btn-disabled';
    }
});

Template.plus_button.events({
    'click button.js-button'( ev, instance ){
        if( !Meteor.userId()){
            return false;
        }
    }
});
