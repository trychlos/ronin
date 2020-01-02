/*
 * 'review_tabs' component.
 *  Display projects and single actions as tabs.
 * 
 *  Parameters:
 *  - counters: the list of root nodes of the embedded trees,
 *      which must have been previously fetched by reviewWindow.
 * 
 *  Session variables:
 *  - review.tab.name: the current tab.
 */
import { Counters } from '/imports/api/collections/counters/counters.js';
import '/imports/client/components/projects_tree/projects_tree.js';
import '/imports/client/interfaces/itabbed/itabbed.js';
import './review_tabs.html';

Template.review_tabs.onCreated( function(){
    this.handle = this.subscribe('counters.root.tree');
});

Template.review_tabs.onRendered( function(){
    this.autorun(() => {
        if( this.handle.ready()){
            $('.review-tabbed').ITabbed();
        }
    });
});

Template.review_tabs.helpers({
    counters(){
        return Counters.find({ name:'root' }, { sort: { nid: 1 }});
    }
});
