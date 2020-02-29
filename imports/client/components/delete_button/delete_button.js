/*
 * 'delete_button' template.
 *
 *  Delete the item after a user confirmation.
 *
 *  Parameters:
 *  - item: the article to be transformed.
 */
import './delete_button.html';

Template.delete_button.events({
    'click .js-delete'( event, instance ){
        $.pubsub.publish( 'ronin.model.article.delete', instance.data.item );
        return false;
    }
});
