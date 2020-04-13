/*
 * 'plus_button' template.
 *
 *  Display a button on the bottom right of the page.
 *  The positionning is *absolute*.
 *
 *  If an activable Action is attached to the button via its data context, then
 *  this action will be automatically activated if the user clicks the button.
 *  In this case, event propagation will be stopped.
 *
 * Parameters:
 * - action: maybe:
 *   > an activable Action object instance
 *   > a function which returns an activable Action object instance.
 */
import './plus_button.html';

Template.plus_button.fn = {
    // the action passed in the data context may be an Action object instance
    //  or a function which is expected to return this Action object instance.
    action( data ){
        return data && data.action ? ( typeof data.action === 'function' ? data.action() : data.action ) : null;
    }
};

Template.plus_button.helpers({
    // not able to make the 'disabled' Bootstrap button attribute working
    // the jQuery 'ui-state-disabled' blocks events to be catched here, but not to bubble (!)
    //  => so use a dedicated class
    classes(){
        let activable = false;
        const action = Template.plus_button.fn.action( this );
        if( action ){
            activable = action.activable();
        }
        return activable ? '': 'disabled';
    }
});

Template.plus_button.events({
    'click button.js-button'( ev, instance ){
        const action = Template.plus_button.fn.action( instance.data );
        if( action ){
            action.activate();
            return false;
        }
    }
});
