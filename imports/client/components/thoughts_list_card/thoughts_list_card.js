/*
 * 'thoughts_list_card' component.
 *  Open the 'thought' card.
 *
 *  Parameters:
 *  - thought: the thought to be edited.
 */
import './thoughts_list_card.html';

Template.thoughts_list_card.helpers({
    // if the window is not wide enough to display the update date in the header,
    //  then display it now
    classCreatedAt(){
        return $(window).innerWidth() <= 480 ? '' : 'x-hidden';
    }
});

Template.thoughts_list_card.events({
    'click .js-edit'( event, instance ){
        //console.log( instance.data.thought );
        Session.set( 'collect.thought', instance.data.thought );
        FlowRouter.go( 'collect.edit' );
        return false;
    },
    'click .js-action'( event, instance ){

    },
    'click .js-project'( event, instance ){

    },
    'click .js-maybe'( event, instance ){

    },
    'click .js-delete'( event, instance ){
        $( event.target ).trigger( 'ronin.model.thought.delete', instance.data.thought );
        return false;
    }
});
