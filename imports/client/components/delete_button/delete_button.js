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

Template.delete_button.onRendered( function(){
    const self = this;

    this.autorun(() => {
        Ronin.enableActionButton( self.data, self.$( '.js-delete-button' ));
    });
});

Template.delete_button.events({
    'click .js-delete-button'( event, instance ){
        return Ronin.activateActionButton( instance.data );
    }
});
