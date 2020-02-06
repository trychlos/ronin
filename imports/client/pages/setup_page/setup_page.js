/*
 * 'setupPage' page.
 *  Runs and manages the non modal 'setupWindow' window.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> pageLayout { gtd, page, window }
 *              +-> collectPage { gtd, page, window }
 *
 *  Parameters:
 *  - 'window': the window to be run (from routes.js)
 *      here, maybe thoughtEdit, thoughtsList
 *
 *  Session variables:
 *  - 'layout.context': the data passed from layout (from routes.js)
 */
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import '/imports/client/windows/setup_window/setup_window.js';
import './setup_page.html';

Template.setupPage.onRendered( function(){
    this.autorun(() => {
        const context = Session.get( 'layout.context' );
        if( context.window && g[LYT_WINDOW].taskbar.get()){
            $('.setup-page').IWindowed( 'show', context.window );
        }
    })
});
