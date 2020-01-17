/*
 * 'processPage' page.
 *  Runs and manages the non modal 'processWindow' window.
 */
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import '/imports/client/windows/process_window/process_window.js';
import './process_page.html';

Template.processPage.onRendered( function(){
    this.autorun(() => {
        if( g[LYT_DESKTOP].taskbar.get()){
            $('.process-page').IWindowed( 'show', 'processWindow' );
        }
    })
});
