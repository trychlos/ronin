/*
 * 'reviewWindow' window.
 *  This is the main component for projects and actions reviewing.
 */
import '/imports/ui/components/review_tabs/review_tabs.js';
import '/imports/ui/interfaces/iwindowed/iwindowed.js';
import './review_window.html';

Template.reviewWindow.onRendered( function(){
    this.autorun(() => {
        if( g.taskbar.get()){
            $('div.review-window').IWindowed({
                id:    'reviewWindow',
                title: 'Review, Organize, Do'
            });
        }
    });
});
