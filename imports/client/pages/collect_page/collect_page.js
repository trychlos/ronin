/*
 * 'collectPage' page.
 *  The main page for the 'collect' features group.
 *  This page, along with the corresponding windows, must be layout-agnostic.
 *
 *  Via custom events, we manage here all insert/update/delete operations on
 *  thoughts:
 *  - the session variable 'collect.thought' holds the initial object
 *  - the session variable 'collect.dbope' holds the db operation result:
 *      0 - waiting for operation
 *      1 - operation error
 *      2 - success, leave the page (successful update only)
 *      3 - success, stay in the page, and reinit it.
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
 *
 *  NB: template lifecycle.
 *      Even if we manually render the template with Blaze.render(), we have
 *      checked that the created 'collectWindow' window was rightly destroyed
 *      on route change. This is done automagically by Meteor as the parent
 *      'collectPage' itself is also destroyed on route change.
 *      So, no need to keep trace of the returned View.
 *      http://blazejs.org/api/blaze.html#Blaze-render
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import bootbox from 'bootbox/dist/bootbox.all.min.js';
import '/imports/assets/dbope_status/dbope_status.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import '/imports/client/windows/shadow_window/shadow_window.js';
import '/imports/client/windows/thought_edit/thought_edit.js';
import '/imports/client/windows/thoughts_list/thoughts_list.js';
import './collect_page.html';

Template.collectPage.onCreated( function(){
    console.log( 'collectPage.onCreated' );
    //console.log( this.data );
});

Template.collectPage.onRendered( function(){
    /*
    this.autorun(() => {
        const context = Session.get( 'layout.context' );
        if( context.window && g[LYT_WINDOW].taskbar.get()){
            $('.collect-page').IWindowed.show( context.window );
            //Blaze.render( Template.thoughtEdit, document.getElementById( g[LYT_WINDOW].rootId ));
        }
    })
    */
});

Template.collectPage.helpers({
    // datas passed from routes.js are available here in 'data' context
    windowContext(){
        //console.log( Template.instance().data );
        return {
            gtd: Template.instance().data.gtd
        }
    }
});

Template.collectPage.onDestroyed( function(){
    console.log( 'collectPage.onDestroyed' );
});
