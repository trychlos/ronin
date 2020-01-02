/*
 * 'processPage' page.
 *  Runs and manages the non modal 'processWindow' window.
 */
import '/imports/ui/interfaces/iwindowed/iwindowed.js';
import '/imports/ui/windows/process_window/process_window.js';
import './process_page.html';

Template.processPage.onRendered( function(){
    this.autorun(() => {
        if( g.taskbar.get()){
            $('.process-page').IWindowed( 'show', 'processWindow' );
        }
    })
});
