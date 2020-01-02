/*
 * 'process_tabs' component.
 *  The component which encapsulates the three differents ways for a thought.
 * 
 *  Parameters:
 *  - thought: an one-item-array with the current thought
 */
import '/imports/client/components/to_action/to_action.js';
import '/imports/client/components/to_project/to_project.js';
import '/imports/client/components/to_maybe/to_maybe.js';
import '/imports/client/interfaces/itabbed/itabbed.js';
import './process_tabs.html';

Template.process_tabs.onRendered( function(){
    $('.process-tabbed').ITabbed();
});
