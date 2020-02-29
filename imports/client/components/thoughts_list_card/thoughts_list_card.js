/*
 * 'thoughts_list_card' component.
 *  Open the 'thought' card.
 *
 *  Parameters:
 *  - thought: the thought to be edited.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import '/imports/client/components/action_button/action_button.js';
import '/imports/client/components/delete_button/delete_button.js';
import '/imports/client/components/edit_button/edit_button.js';
import '/imports/client/components/maybe_button/maybe_button.js';
import '/imports/client/components/ownership_button/ownership_button.js';
import '/imports/client/components/project_button/project_button.js';
import './thoughts_list_card.html';

Template.thoughts_list_card.helpers({
    // if the window is not wide enough to display the update date in the header,
    //  then display it now
    classCreatedAt(){
        return $(window).innerWidth() <= 480 ? '' : 'x-hidden';
    }
});
