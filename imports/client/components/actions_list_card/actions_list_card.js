/*
 * 'actions_list_card' component.
 *  Open the 'action' card.
 *
 *  Parameters:
 *  - action: the action to be edited.
 */
import './actions_list_card.html';

Template.actions_list_card.helpers({
    checked(){
        return moment( Template.instance().data.action.doneDate ).isValid() ? 'checked' : '';
    },
    // if the window is not wide enough to display the update date in the header,
    //  then display it now
    classCreatedAt(){
        return $(window).innerWidth() <= 480 ? '' : 'x-hidden';
    }
});

Template.actions_list_card.events({
    'click .js-edit'( ev, instance ){
        //console.log( instance.data.action );
        g.run.back = FlowRouter.current().route.name;
        FlowRouter.go( 'action.edit', null, { id:instance.data.action._id });
        return false;
    },
    'click .js-done'( ev, instance ){
        $.pubsub.publish( 'ronin.model.action.done.toggle', { action: instance.data.action });
        return false;
    },
    'click .js-delete'( ev, instance ){
        $.pubsub.publish( 'ronin.model.action.delete', instance.data.action );
        return false;
    }
});
