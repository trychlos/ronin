/*
 * 'collectPage' page.
 *  The main page for the 'collect' features group.
 *  This page, along with the corresponding window, must be layout-agnostic.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> pageLayout { group, page, window }
 *              +-> collectPage { group, window }
 *
 *  Parameters:
 *  - 'group': the identifier of this features's group
 *  - 'window': the window to be run
 *      here: might be collectList, collectEdit.
 *
 *  NB: template lifecycle.
 *      Even if we manually render the template with Blaze.render(), we have
 *      checked that the created 'collectWindow' window was rightly destroyed
 *      on route change. This is done automagically by Meteor as the parent
 *      'collectPage' itself is also destroyed on route change.
 *      So, no need to keep trace of the returned View.
 *      http://blazejs.org/api/blaze.html#Blaze-render
 */
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import '/imports/client/windows/collect_list/collect_list.js';
import '/imports/client/windows/collect_edit/collect_edit.js';
import './collect_page.html';

Template.collectPage.onCreated( function(){
    //console.log( this.data );
});

Template.collectPage.onRendered( function(){
    this.autorun(() => {
        if( g.run.layout.get() === LYT_WINDOW && g[LYT_WINDOW].taskbar.get()){
            $('.collect-page').IWindowed( 'show', this.data.window );
        }
    })
});

Template.collectPage.helpers({
    windowContext(){
        return {
            group: Template.instance().data.group
        }
    }
});
