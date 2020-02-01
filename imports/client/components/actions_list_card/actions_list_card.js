/*
 * 'actions_list_card' component.
 *  Open the 'action' card.
 *
 *  Parameters:
 *  - action: the action to be edited.
 */
import './actions_list_card.html';

Template.actions_list_card.helpers({
    // if the window is not wide enough to display the update date in the header,
    //  then display it now
    classCreatedAt(){
        return $(window).innerWidth() <= 480 ? '' : 'x-hidden';
    }
});

Template.actions_list_card.events({
    'click .js-edit'( event, instance ){
        //console.log( instance.data.action );
        Session.set( 'review.action', instance.data.action );
        FlowRouter.go( 'review.edit' );
        return false;
    },
    'click .js-action'( event, instance ){
        Session.set( 'review.action', instance.data.action );
        FlowRouter.go( 'process.action' );
        return false;
    },
    'click .js-project'( event, instance ){
        Session.set( 'review.action', instance.data.action );
        FlowRouter.go( 'process.project' );
        return false;
    },
    'click .js-maybe'( event, instance ){

    },
    'click .js-delete'( event, instance ){
        $( event.target ).trigger( 'ronin.model.action.delete', instance.data.action );
        return false;
    }
});
