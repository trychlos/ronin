/*
 * 'reviewPage' page.
 *  Runs and manages the non modal 'reviewWindow' window.
 */
import '/imports/ui/interfaces/iwindowed/iwindowed.js';
import '/imports/ui/windows/review_window/review_window.js';
import './review_page.html';

Template.reviewPage.onRendered( function(){
    this.autorun(() => {
        if( g.taskbar.get()){
            $('.review-page').IWindowed( 'show', 'reviewWindow' );
        }
    })
});
