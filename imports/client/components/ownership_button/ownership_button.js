/*
 * 'ownership_button' template.
 *
 *  Display a button to let the user take ownership of the item.
 *
 *  Parameters:
 *  - item: the article.
 */
import './ownership_button.html';

Template.ownership_button.helpers({
    // template helper
    //  returns true if this article is owned by the user
    isMine( art ){
        const current = Meteor.userId();
        return current && current === art.userId;
    },
    // class helper
    takeable( art ){
        const takeable = Template.thoughts_list_card.fn.takeable( art );
        return takeable ? '' : 'ui-state-disabled';
    }
});

Template.ownership_button.events({
    'click .js-ownership'( event, instance ){
        $.pubsub.publish( 'ronin.model.article.ownership', instance.data.item );
        return false;
    }
});
