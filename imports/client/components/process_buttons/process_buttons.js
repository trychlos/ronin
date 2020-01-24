/*
 * 'process_buttons' component.
 *  A component which:
 *  - displays three buttons for child page selection
 *  - run three child pages for project, action or maybe creation.
 *
 *  Only used on small touch devices.
 *
 *  Parameters:
 *  - thought: an one-item-array with the current thought
 */
import '/imports/client/components/to_action/to_action.js';
import '/imports/client/components/to_action_panel/to_action_panel.js';
import '/imports/client/components/to_project/to_project.js';
import '/imports/client/components/to_maybe/to_maybe.js';
import './process_buttons.html';

Template.process_buttons.fn = {
    views: {
        action: null,
        project: null,
        maybe: null
    }
};

Template.process_buttons.onDestroyed( function(){

});

Template.process_buttons.events({
    'click .js-action'( event, instance ){
        console.log( 'rendering toActionPanel' );
        Template.process_buttons.fn.views.action =
            Blaze.renderWithData(
                Template.toActionPanel,
                instance.data,
                document.getElementsByClassName('process-window')[0] );
        return false;
    },
    'click .js-project'( event, instance ){
        //const view = Blaze.render( Template.toProjectPanel, document.getElementsByClassName('process-window')[0] );
    },
    'click .js-maybe'( event, instance ){
        //const view = Blaze.render( Template.toMaybePanel, document.getElementsByClassName('process-window')[0] );
    }
});
