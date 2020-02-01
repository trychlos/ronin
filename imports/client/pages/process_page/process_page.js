/*
 * 'processPage' page.
 *  The main page for the 'process' features group.
 *  This page, along with the corresponding windows, must be layout-agnostic.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> pageLayout { gtd, page, window }
 *              +-> processPage { gtd, window }
 *
 *  Parameters:
 *  - 'gtd': the identifier of this features's group item
 *  - 'window': the window to be run
 *      here: might be collectList, collectEdit.
 */
import '/imports/assets/dbope_status/dbope_status.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import '/imports/client/windows/action_process/action_process.js';
import '/imports/client/windows/project_process/project_process.js';
import './process_page.html';

Template.processPage.onRendered( function(){
    this.autorun(() => {
        if( g.run.layout.get() === LYT_WINDOW && g[LYT_WINDOW].taskbar.get()){
            $('.process-page').IWindowed( 'show', 'processWindow' );
        }
    })
});

Template.processPage.helpers({
    windowContext(){
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
