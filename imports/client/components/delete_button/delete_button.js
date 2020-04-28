/*
 * 'delete_button' template.
 *
 *  Delete the item after a user confirmation.
 *
 *  Parameters:
 * - action: may be:
 *   > an activable Action object instance
 *   > a function which returns an activable Action object instance.
 */
import './delete_button.html';

Template.delete_button.fn = {
    // the action passed in the data context may be an Action object instance
    //  or a function which is expected to return this Action object instance.
    action( data ){
        return data && data.action ? ( typeof data.action === 'function' ? data.action() : data.action ) : null;
    }
};

Template.delete_button.onRendered( function(){
    const self = this;

    this.autorun(() => {
        const action = Template.delete_button.fn.action( self.data );
        const activable = action ? action.activable() : false;
        const $button = self.$( '.js-delete-button' );
        if( activable ){
            $button.attr( 'disabled', false );
            $button.removeClass( 'ui-state-disabled' );
        } else {
            $button.attr( 'disabled', true );
            $button.addClass( 'ui-state-disabled' );
        }
    });
});

Template.delete_button.events({
    'click .js-delete-button'( event, instance ){
        const action = Template.delete_button.fn.action( instance.data );
        if( action ){
            action.activate();
            return false;
        }
    }
});
