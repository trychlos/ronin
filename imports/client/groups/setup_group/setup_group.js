/*
 * 'setupGroup' group layer.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> <app layout layer> { gtdid, group, template }
 *              +-> <group layer> { gtdid, group, template }
 *
 *  Parameters:
 *  - 'data': the layout context built in and passed by appLayout.
 *
 *  Session variables:
 *  - 'layout.context': this is a copy of the data context passed in from routes.js
 *      It let our layers (app, group, window) be reactive against route changes.
 *      Caution: must only be used at rendering time, as it will be superseded
 *      by later changes.
 */
import '/imports/client/windows/thought_edit/thought_edit.js';
import '/imports/client/windows/thoughts_list/thoughts_list.js';
import './setup_group.html';

Template.setupGroup.onCreated( function(){
    console.log( 'setupGroup.onCreated' );
});

Template.setupGroup.onRendered( function(){
    console.log( 'setupGroup.onRendered' );
    this.autorun(() => {
        const context = Template.currentData();
        if( context.template && g[LYT_WINDOW].taskbar.get()){
            $().IWindowed.show( context.template, context );
        }
    })
});

Template.setupGroup.helpers({
    // template helper
    windowTemplate(){
        return Template.currentData().template;
    },
    // template helper
    layoutContext(){
        return Template.currentData();
    }
});

Template.setupGroup.onDestroyed( function(){
    console.log( 'setupGroup.onDestroyed' );
});