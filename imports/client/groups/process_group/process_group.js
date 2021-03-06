/*
 * 'processGroup' group layer.
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
import '/imports/client/windows/project_edit/project_edit.js';
import '/imports/client/windows/action_edit/action_edit.js';
import './process_group.html';

Template.processGroup.onCreated( function(){
    //console.log( 'processGroup.onCreated' );
});

Template.processGroup.onRendered( function(){
    //console.log( 'processGroup.onRendered' );
    this.autorun(() => {
        const context = Template.currentData();
        if( context.template && Ronin.ui.layouts[R_LYT_WINDOW].taskbar.get()){
            $().IWindowed.show( context );
        }
    })
});

Template.processGroup.helpers({
    // template helper
    windowTemplate(){
        return Template.currentData().template;
    },
    // template helper
    layoutContext(){
        return Template.currentData();
    }
});

Template.processGroup.onDestroyed( function(){
    //console.log( 'processGroup.onDestroyed' );
});
