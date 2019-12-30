/*
 * 'process_dispatch' component.
 *  The component which encapsulates the three differents ways for a thought.
 *  Parameters:
 *  - thought: an one-item-array with the current thought
 */
import { Meteor } from 'meteor/meteor';
import '/imports/ui/components/to_action/to_action.js';
import '/imports/ui/components/to_project/to_project.js';
import './process_dispatch.html';

Template.process_dispatch.onRendered( function(){
    $('#tabs').tabs({
        active: 0,
    });
});
