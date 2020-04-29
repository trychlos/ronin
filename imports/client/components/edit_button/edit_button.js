/*
 * 'edit_button' template.
 *
 *  Edit the item.
 *
 *  Parameters:
 * - action: may be:
 *   > an activable Action object instance
 *   > a function which returns an activable Action object instance.
 */
import './edit_button.html';

Template.edit_button.onRendered( function(){
    const self = this;

    this.autorun(() => {
        Ronin.enableActionButton( self.data, self.$( '.js-edit-button' ));
    });
});

Template.edit_button.events({
    'click .js-edit-button'( event, instance ){
        return Ronin.activateActionButton( instance.data );
    }
});
