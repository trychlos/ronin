/*
 * 'ownership_button' template.
 *
 *  Display a button to let the user take ownership of the item.
 *
 *  Parameters:
 *  - item: the article.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import './ownership_button.html';

Template.ownership_button.helpers({
    // template helper
    //  returns true if this article is owned by the user
    isMine( art ){
        const status = Articles.fn.isTakeable( art );
        return status === 'HAS';
    },
    // class helper
    //  disable the button is the ownership cannot be taken
    takeable( art ){
        const status = Articles.fn.isTakeable( art );
        return status === 'CAN' ? '' : 'ui-state-disabled';
    }
});

Template.ownership_button.events({
    'click .js-ownership'( event, instance ){
        $.pubsub.publish( 'ronin.model.article.ownership', instance.data.item );
        return false;
    }
});
