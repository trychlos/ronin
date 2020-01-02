/*
 * 'reviewWindow' window.
 *  This is the main component for projects and actions reviewing.
 */
import '/imports/client/components/review_tabs/review_tabs.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './review_window.html';

Template.reviewWindow.onRendered( function(){
    this.autorun(() => {
        if( g.taskbar.get()){
            $('div.review-window').IWindowed({
                template:   'reviewWindow',
                title:      'Review, Organize, Do'
            });
        }
    });
});
