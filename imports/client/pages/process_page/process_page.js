/*
 * 'processPage' page.
 *  Runs and manages the non modal 'processWindow' window.
 */
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import '/imports/client/windows/process_window/process_window.js';
import './process_page.html';

Template.processPage.onRendered( function(){
    this.autorun(() => {
        switch( g.run.layout.get()){
            case LYT_WINDOW:
                if( g[LYT_WINDOW].taskbar.get()){
                    $('.process-page').IWindowed( 'show', 'processWindow' );
                }
                break;
            case LYT_PAGE:
                Blaze.render( Template.processWindow, document.getElementsByClassName('process-page')[0] );
                break;
        }
    })
});
