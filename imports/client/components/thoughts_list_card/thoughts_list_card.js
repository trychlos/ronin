/*
 * 'thoughts_list_card' component.
 *  Open the thought card.
 *
 *  Parameters:
 *  - thought: the thought to be edited.
 */
import { Thoughts } from '/imports/api/collections/thoughts/thoughts.js';
import './thoughts_list_card.html';

Template.thoughts_list_card.helpers({
    classCreatedAt(){
        return $(window).innerWidth() <= 480 ? '' : 'x-hidden';
    }
});
