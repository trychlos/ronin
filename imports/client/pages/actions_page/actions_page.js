/*
 * 'actionsPage' page.
 *  Runs and manages the non modal 'actionsWindow' window.
 */
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import '/imports/client/windows/actions_window/actions_window.js';
import './actions_page.html';

Template.actionsPage.onRendered( function(){
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            $('.actions-page').IWindowed( 'show', 'actionsWindow' );
        }
    })
});
