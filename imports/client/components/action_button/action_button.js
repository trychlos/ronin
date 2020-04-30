/*
 * 'action_button' template.
 *
 *  Transform a thought into an action.
 *
 *  Parameters:
 * - action: may be:
 *   > an activable Action object instance
 *   > a function which returns an activable Action object instance.
 */
import './action_button.html';

Template.action_button.onRendered( function(){
    this.autorun(() => {
        Ronin.enableActionButton( Template.currentData(), Template.instance().$( '.js-action' ));
    });
});

Template.action_button.events({
    'click .js-action'( event, instance ){
        return Ronin.activateActionButton( instance.data );
    }
});
