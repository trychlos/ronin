/*
 * 'review_tabs' component.
 *  Display projects and single actions as tabs.
 * 
 *  Parameters:
 *  - counters: the list of root nodes of the embedded trees.
 * 
 *  Session variables:
 *  - review.tab.name: the current tab.
 * 
 * NB: in the first version, which used jQuery Tabs, we had a Counters subscription
 *  in the onCreated callback, and cursor provider as a helper. These two let us
 *  have a dynamic HTML.
 *  As a matter of fact, we are unable to work the same way with jqxTabs. Don't know why :(
 *  Have been tried:
 *  - a Counters cursor here (idem than jQuery Tabs)
 *  - a Counters cursor provided by review_window
 *  - a JSON.stringified Counters cursor provided by review_window
 *  but none of these works...
 */
import '/imports/ui/components/projects_tree/projects_tree.js';
import '/imports/ui/interfaces/itabbed/itabbed.js';
import './review_tabs.html';

Template.review_tabs.onRendered( function(){
    $('.review-tabbed').iTabbed({});
});
