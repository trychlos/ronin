/*
 * 'delete_button' template.
 *
 *  Delete the item after a user confirmation.
 *
 *  Parameters:
 *  - item: the article to be transformed
 *  - disabled: 'disabled' if the button is to be disabled
 *      default is to enable the button
 *  - message: the message to be sent
 *      default is to send 'ronin.model.item.delete' which is valid for Articles.
 */
import './delete_button.html';

Template.delete_button.helpers({
    // class helper
    disabled(){
        return this.disabled === 'disabled' ? 'ui-state-disabled' : '';
    }
});

Template.delete_button.events({
    'click .js-delete'( event, instance ){
        const msg = instance.data.message || 'ronin.model.item.delete';
        $.pubsub.publish( msg, instance.data.item );
        return false;
    }
});
