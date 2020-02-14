/*
 * 'collectGroup' group layer.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> <app layout layer> { gtdid, group, template }
 *              +-> <group layer> { gtdid, group, template }
 *
 *  Parameters:
 *  - 'data': the layout context built in appLayout, and passed in by windowLayer.
 *
 *  Session variables:
 *  - 'layout.context': this is a copy of the data context passed in from routes.js
 *      It let our layers (app, group, window) be reactive against route changes.
 *      Caution: must only be used at rendering time, as it will be superseded
 *      by later changes.
 */
import '/imports/client/windows/thought_edit/thought_edit.js';
import '/imports/client/windows/thoughts_list/thoughts_list.js';
import './collect_group.html';

Template.collectGroup.onCreated( function(){
    console.log( 'collectGroup.onCreated' );
});

Template.collectGroup.onRendered( function(){
    console.log( 'collectGroup.onRendered' );
    this.autorun(() => {
        const context = Session.get( 'layout.context' );
        if( context.template && g[LYT_WINDOW].taskbar.get()){
            $( 'body' ).IWindowed.show( context.template, context );
        }
    })
});

Template.collectGroup.helpers({
    // template helper
    windowTemplate(){
        return Session.get( 'layout.context' ).template;
    },
    // template helper
    layoutContext(){
        return Session.get( 'layout.context' );
    }
});

Template.collectGroup.onDestroyed( function(){
    console.log( 'collectGroup.onDestroyed' );
});
