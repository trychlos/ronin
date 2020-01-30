/*
 * 'thoughts_list' component.
 *  Display the specified list of thoughts, giving a cursor (aka an array)
 *
 *  Parameters:
 *  - thoughts: the cursor (aka an array) to be displayed
 *  - title: true|false whether to display the title
 *  - editable: whether the items are editable/deletable;
 *      apply to each and every item of the cursor as a whole;
 *      defaults to true
 *
 *  NB: this component is used both as a reminder when collecting new thoughts,
 *      and as a dispatcher when processing thoughts.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import '/imports/client/components/thoughts_list_item/thoughts_list_item.js';
import './thoughts_list.html';

Template.thoughts_list.helpers({
    // on smartphone, only two columns are displayed -> 7-4-1
    // on wider screens, three columns are displayed -> 5-3-3-1
    colclassCreatedAt(){
        return $(window).innerWidth()<481 ? 'x-hidew480' : 'col-3';
    },
    colclassName(){
        return $(window).innerWidth()<481 ? 'col-6' : 'col-5';
    },
    colclassTopic(){
        return $(window).innerWidth()<481 ? 'col-4' : 'col-3';
    },
    lineHeight(){
        return g.run.layout.get() === LYT_PAGE ? 'x-trh3' : '';
    }
});
