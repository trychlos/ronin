/*
 * 'thoughts_list_card' component.
 *  Open the 'thought' card.
 *
 *  Parameters:
 *  - thought: the thought to be edited.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import './thoughts_list_card.html';

Template.thoughts_list_card.helpers({
    // if the window is not wide enough to display the update date in the header,
    //  then display it now
    classCreatedAt(){
        return $(window).innerWidth() <= 480 ? '' : 'x-hidden';
    },
    // class helper
    // if the article is not owned by anyone, then the logged-in user may take
    //  ownership of it
    //  We have so three states:
    //  - user is not logged in: button is disabled
    //  - user already has ownership of the article: button is displayed as green
    //  - the article does not yet belong to anyone: button is normal
    ownershipTakeable( art ){
        const current = Meteor.userId();
        if( current ){
            if( art.userId === current ){
                return 'ownership-owned';
            } else if( art.userId ){
                console.log( 'Ownership error with thought '+art._id );
                return 'ownership-disabled'
            } else {
                return 'ownership-takeable';
            }
        } else {
            return 'owernship-disabled';
        }
    }
});

Template.thoughts_list_card.events({
    'click .js-edit'( event, instance ){
        //console.log( instance.data.thought );
        Session.set( 'collect.thought', instance.data.thought );
        FlowRouter.go( 'collect.edit' );
        return false;
    },
    'click .js-ownership'( event, instance ){
        Meteor.call( 'articles.ownership', instance.data.thought._id, ( e, res ) => {
            if( e ){
                throwError({ type:e.error, message: e.reason });
            } else {
                throwSuccess( 'Ownership successfully taken' );
            }
        });
        return false;
    },
    'click .js-action'( event, instance ){
        Session.set( 'collect.thought', instance.data.thought );
        FlowRouter.go( 'process.action' );
        return false;
    },
    'click .js-project'( event, instance ){
        Session.set( 'collect.thought', instance.data.thought );
        FlowRouter.go( 'process.project' );
        return false;
    },
    'click .js-maybe'( event, instance ){

    },
    'click .js-delete'( event, instance ){
        $( event.target ).trigger( 'ronin.model.thought.delete', instance.data.thought );
        return false;
    }
});
