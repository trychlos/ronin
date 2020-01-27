/*
 * 'setupPage' page.
 *  Runs and manages the non modal 'setupWindow' window.
 */
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import '/imports/client/windows/setup_window/setup_window.js';
import './setup_page.html';

Template.setupPage.onRendered( function(){
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            $('.setup-page').IWindowed( 'show', 'setupWindow' );
        }
    })
});
