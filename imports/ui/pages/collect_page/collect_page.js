/*
 * 'collectPage' page.
 *  Runs and manages the non modal 'collectWindow' window.
 */
import '/imports/ui/interfaces/iwindowed/iwindowed.js';
import '/imports/ui/windows/collect_window/collect_window.js';
import './collect_page.html';

Template.collectPage.onRendered( function(){
    this.autorun(() => {
        if( g.taskbar.get()){
            $('.collect-page').IWindowed( 'show', 'collectWindow' );
        }
    })
});
