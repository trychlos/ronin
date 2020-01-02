/*
 * 'reviewWindow' window.
 *  This is the main component for projects and actions reviewing.
 */
import { Counters } from '/imports/api/collections/counters/counters.js';
import '/imports/ui/components/review_tabs/review_tabs.js';
import '/imports/ui/interfaces/iwindowed/iwindowed.js';
import './review_window.html';

Template.reviewWindow.onCreated( function(){
    this.subscribe('counters.all');
});

Template.reviewWindow.onRendered( function(){
    this.autorun(() => {
        if( g.taskbar.get()){
            $('div.review-window').iWindowed({
                id:    'reviewWindow',
                title: 'Review, Organize, Do'
            });
        }
    });
});

Template.reviewWindow.helpers({
    counters(){
        // this is a sort of hack as review_tabs helper seems to not provide the expected
        //  structure for jqxTabs (whatever this may mean)
        return Counters.find({ name: 'root' }, { sort:{ nid: 1 }});
    }
});
