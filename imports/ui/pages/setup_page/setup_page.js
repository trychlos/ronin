/*
 * 'setupPage' page.
 *  Runs and manages the non modal 'setupWindow' window.
 */
import '/imports/ui/interfaces/iwindowed/iwindowed.js';
import '/imports/ui/windows/setup_window/setup_window.js';
import './setup_page.html';

Template.setupPage.onRendered( function(){
    this.autorun(() => {
        if( g.taskbar.get()){
            $('.setup-page').IWindowed( 'show', 'setupWindow' );
        }
    })
});
