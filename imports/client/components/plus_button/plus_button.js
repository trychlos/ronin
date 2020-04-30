/*
 * 'plus_button' template.
 *
 *  Display a button on the bottom right of the page.
 *  The positionning is *absolute*.
 *
 *  If an activable Action is attached to the button via its data context, then
 *  this action will be automatically activated if the user clicks the button.
 *  In this case, event propagation will be stopped.
 *
 * Parameters:
 * - action: may be:
 *   > an activable Action object instance
 *   > a function which returns an activable Action object instance.
 */
import './plus_button.html';

Template.plus_button.onRendered( function(){
    this.autorun(() => {
        Ronin.enableActionButton( Template.currentData(), Template.instance().$( '.js-plus-button' ));
    });
});

Template.plus_button.events({
    'click .js-plus-button'( ev, instance ){
        return Ronin.activateActionButton( instance.data );
    }
});
