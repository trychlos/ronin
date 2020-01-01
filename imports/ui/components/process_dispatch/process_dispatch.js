/*
 * 'process_dispatch' component.
 *  The component which encapsulates the three differents ways for a thought.
 * 
 *  Parameters:
 *  - thought: an one-item-array with the current thought
 */
import '/imports/ui/components/to_action/to_action.js';
import '/imports/ui/components/to_project/to_project.js';
import '/imports/ui/components/to_maybe/to_maybe.js';
import '/imports/ui/interfaces/itabbed/itabbed.js';
import './process_dispatch.html';

Template.process_dispatch.onRendered( function(){
    this.autorun(() => {
        $('.process-tabs').iTabbed({});
    })
});
