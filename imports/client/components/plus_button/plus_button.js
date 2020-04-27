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
 * - action: may be:
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

Template.plus_button.onRendered( function(){
    const self = this;

    this.autorun(() => {
        const action = Template.plus_button.fn.action( self.data );
        const activable = action ? action.activable() : false;
        const $button = self.$( '.js-plus-button' );
        if( activable ){
            $button.attr( 'disabled', false );
            $button.removeClass( 'ui-state-disabled' );
        } else {
            $button.attr( 'disabled', true );
            $button.addClass( 'ui-state-disabled' );
        }
    });
});

Template.plus_button.events({
    // Please note that even if a disabled button doesn't trigger any event,
    //  an uncatched click may still be handled by the englobing div
    //  returning false here does prevent this bubbling
    'click .js-plus-button'( ev, instance ){
        const action = Template.plus_button.fn.action( instance.data );
        if( action ){
            //console.log( 'action.activate();' );
            action.activate();
            return false;
        }
    }
});
