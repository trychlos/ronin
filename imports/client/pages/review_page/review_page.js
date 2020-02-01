/*
 * 'reviewPage' page.
 *  The main page for the 'review' features group.
 *  This page, along with the corresponding windows, must be layout-agnostic.
 *
 *  Via custom events, we manage here all insert/update/delete operations on
 *  actions:
 *  - the session variable 'review.action' holds the initial object
 *  - the session variable 'review.dbope' holds the db operation result:
 *      0 - waiting for operation
 *      1 - operation error
 *      2 - success, leave the page (successful update only)
 *      3 - success, stay in the page, and reinit it.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> pageLayout { gtd, page, window }
 *              +-> reviewPage { gtd, window }
 *
 *  Parameters:
 *  - 'gtd': the identifier of this features's group item
 *  - 'window': the window to be run
 *      here: might be actionsList, actionsEdit, projectsList, projectsEdit...
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import bootbox from 'bootbox/dist/bootbox.all.min.js';
import '/imports/assets/dbope_status/dbope_status.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import '/imports/client/windows/action_edit/action_edit.js';
import '/imports/client/windows/actions_list/actions_list.js';
import '/imports/client/windows/projects_list/projects_list.js';
import './review_page.html';

Template.reviewPage.onCreated( function(){
    //console.log( this.data );
});

Template.reviewPage.onRendered( function(){
    this.autorun(() => {
        if( g.run.layout.get() === LYT_WINDOW && g[LYT_WINDOW].taskbar.get()){
            $('.review-page').IWindowed( 'show', this.data.window );
        }
    })
});

Template.reviewPage.helpers({
    windowContext(){
        return {
            gtd: Template.instance().data.gtd
        }
    }
});

Template.reviewPage.events({
    // delete the provided action
    //  requiring a user confirmation
    'ronin.model.action.delete'( ev, instance, action ){
        bootbox.confirm(
            'You are about to delete the "'+action.name+'" action.<br />'+
            'Are you sure ?', function( ret ){
                if( ret ){
                    Meteor.call( 'actions.remove', action._id, ( e, res ) => {
                        if( e ){
                            throwError({ type:e.error, message: e.reason });
                        } else {
                            throwSuccess( 'Action successfully deleted' );
                        }
                    });
                }
            }
        );
        return false;
    },
    // the action has been set as done
    'ronin.model.action.done.toggle'( ev, instance, action ){
        Articles.fn.doneToggle( action );
        return false;
    },
    // insert or update the provided action
    //  if a previous object already existed, then this is an update
    //  the page will be left if this was an update *and* it has been successful
    'ronin.model.action.update'( ev, instance, action ){
        Session.set( 'review.dbope', DBOPE_WAIT );
        const obj = Session.get( 'review.action' );
        const id = obj ? obj._id : null;
        try {
            Articles.fn.check( id, action );
        } catch( e ){
            console.log( e );
            throwError({ type:e.error, message: e.reason });
            return false;
        }
        if( obj ){
            // if nothing has changed, then does nothing
            if( Articles.fn.equal( obj, action )){
                throwMessage({ type:'warning', message:'Nothing changed' });
                return false;
            }
            Meteor.call('actions.update', id, action, ( e, res ) => {
                if( e ){
                    console.log( e );
                    throwError({ type:e.error, message: e.reason });
                    Session.set( 'review.dbope', DBOPE_ERROR );
                } else {
                    throwSuccess( 'Action successfully updated' );
                    Session.set( 'review.dbope', DBOPE_LEAVE );
                }
            });
        } else {
            Meteor.call('actions.insert', action, ( e, res ) => {
                if( e ){
                    console.log( e );
                    throwError({ type:e.error, message: e.reason });
                    Session.set( 'review.dbope', DBOPE_ERROR );
                } else {
                    throwSuccess( 'Action successfully inserted' );
                    Session.set( 'review.action', 'success' );  // force re-rendering
                    Session.set( 'review.dbope', DBOPE_REINIT );
                }
            });
        }
        return false;
    }
});
