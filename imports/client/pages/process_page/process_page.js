/*
 * 'processPage' page.
 *  The main page for the 'process' features group.
 *  This page, along with the corresponding windows, must be layout-agnostic.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> pageLayout { gtd, page, window }
 *              +-> processPage { gtd, page, window }
 *
 *  Parameters:
 *  - 'window': the window to be run (from routes.js)
 *      here, maybe actionEdit, projectEdit
 *
 *  Session variables:
 *  - 'layout.context': the data passed from layout (from routes.js)
 */
import '/imports/assets/dbope_status/dbope_status.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import '/imports/client/windows/action_process/action_process.js';
import '/imports/client/windows/project_process/project_process.js';
import './process_page.html';

Template.processPage.onCreated( function(){
    //console.log( 'processPage.onCreated' );
    //console.log( this.data );
});

Template.processPage.onRendered( function(){
    this.autorun(() => {
        const context = Session.get( 'layout.context' );
        if( context.window && g[LYT_WINDOW].taskbar.get()){
            $('.process-page').IWindowed( 'show', context.window );
        }
    })
});

Template.processPage.helpers({
    // datas passed from routes.js are available here in 'data' context
    windowContext(){
        //console.log( Template.instance().data );
        return {
            gtd: Template.instance().data.gtd
        }
    }
});

Template.processPage.events({
    // transform a thought into an action
    //  the result is asynchronously treated by action/project_process.js
    'ronin.model.thought.action'( ev,instance, action ){
        Session.set( 'review.dbope', DBOPE_WAIT );
        const thought = Session.get( 'collect.thought' );
        Meteor.call( 'actions.from.thought', thought, action, ( e, res ) => {
            if( e ){
                throwError({ type:e.error, message: e.reason });
                Session.set( 'review.dbope', DBOPE_ERROR );
            } else {
                throwSuccess( 'Action successfully created' );
                Session.set( 'review.dbope', DBOPE_LEAVE );
            }
        });
        return false;
    },
    // transform a thought into a project
    'ronin.model.thought.project'( ev,instance, project ){
        Session.set( 'review.dbope', DBOPE_WAIT );
        const thought = Session.get( 'collect.thought' );
        Meteor.call( 'projects.from.thought', thought, project, ( e, res ) => {
            if( e ){
                throwError({ type:e.error, message: e.reason });
                Session.set( 'review.dbope', DBOPE_ERROR );
            } else {
                throwSuccess( 'Project successfully created' );
                Session.set( 'review.dbope', DBOPE_LEAVE );
            }
        });
        return false;
    }
});

Template.processPage.onDestroyed( function(){
    //console.log( 'processPage.onDestroyed' );
});
