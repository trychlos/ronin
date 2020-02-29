/*
 * 'thoughts_list_card' component.
 *  Open the 'thought' card.
 *
 *  Parameters:
 *  - thought: the thought to be edited.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import '/imports/client/components/delete_button/delete_button.js';
import '/imports/client/components/maybe_button/maybe_button.js';
import '/imports/client/components/ownership_button/ownership_button.js';
import '/imports/client/components/project_button/project_button.js';
import './thoughts_list_card.html';

Template.thoughts_list_card.fn = {
    // if the article is not owned by anyone, then the logged-in user may take
    //  ownership of it
    //  We have so three states:
    //  - user is not logged in: button is disabled
    //  - user already has ownership of the article: button is displayed as green
    //  - the article does not yet belong to anyone: button is normal
    takeable: function( article ){
        const current = Meteor.userId();
        const takeable = ( current && !article.userId );
        return takeable;
    }
};

Template.thoughts_list_card.helpers({
    // if the window is not wide enough to display the update date in the header,
    //  then display it now
    classCreatedAt(){
        return $(window).innerWidth() <= 480 ? '' : 'x-hidden';
    },
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

Template.thoughts_list_card.events({
    'click .js-edit'( event, instance ){
        //console.log( instance.data.thought );
        g.run.back = FlowRouter.current().route.name;
        Session.set( 'collect.thought', instance.data.thought );
        FlowRouter.go( 'collect.edit' );
        return false;
    },
    'click .js-action'( event, instance ){
        g.run.back = FlowRouter.current().route.name;
        FlowRouter.go( 'process.action', null, { id:instance.data.thought._id });
        return false;
    }
});
