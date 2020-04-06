/*
 * 'reviewGroup' group layer.
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
import '/imports/client/windows/action_edit/action_edit.js';
import '/imports/client/windows/actions_list/actions_list.js';
import '/imports/client/windows/project_edit/project_edit.js';
import '/imports/client/windows/projects_list/projects_list.js';
import './review_group.html';

Template.reviewGroup.onCreated( function(){
    //console.log( 'reviewGroup.onCreated' );
});

Template.reviewGroup.onRendered( function(){
    //console.log( 'reviewGroup.onRendered' );
    this.autorun(() => {
        const context = Template.currentData();
        if( context.template && Ronin.ui.layouts[LYT_WINDOW].taskbar.get()){
            $().IWindowed.show( context );
        }
    })
});

Template.reviewGroup.helpers({
    // template helper
    windowTemplate(){
        return Template.currentData().template;
    },
    // template helper
    layoutContext(){
        return Template.currentData();
    }
});

Template.reviewGroup.onDestroyed( function(){
    //console.log( 'reviewGroup.onDestroyed' );
});
