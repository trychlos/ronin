/*
 * 'actions_list_card' component.
 *  Open the 'action' card.
 *
 *  Parameters:
 *  - action: the action to be edited.
 */
import '/imports/client/components/delete_button/delete_button.js';
import '/imports/client/components/edit_button/edit_button.js';
import '/imports/client/components/ownership_button/ownership_button.js';
import '/imports/client/components/project_button/project_button.js';
import './actions_list_card.html';

Template.actions_list_card.helpers({
    checked(){
        return this.action.doneDate && moment( this.action.doneDate ).isValid() ? 'checked' : '';
    },
    // if the window is not wide enough to display the update date in the header,
    //  then display it now
    classCreatedAt(){
        return $(window).innerWidth() <= 480 ? '' : 'x-hidden';
    }
});

Template.actions_list_card.events({
    'click .js-done'( ev, instance ){
        $.pubsub.publish( 'ronin.model.action.done.toggle', { action: instance.data.action });
        return false;
    }
});
