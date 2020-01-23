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
import '/imports/client/components/to_project/to_project.js';
import '/imports/client/components/to_maybe/to_maybe.js';
import './process_buttons.html';

Template.process_buttons.events({
    'click .js-action'( event, instance ){

    },
    'click .js-project'( event, instance ){

    },
    'click .js-maybe'( event, instance ){

    }
});
