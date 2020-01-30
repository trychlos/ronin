/*
 * 'collectPage' page.
 *  The main page for the 'collect' features group.
 *  This page, along with the corresponding windows, must be layout-agnostic.
 *
 *  Via custom events, we manager here all insert/update/delete operations on
 *  thoughts:
 *  - the session variable 'collect.thought' holds the initial object
 *  - the session variable 'collect.updated' holds the db operation result:
 *      0 - waiting for operation
 *      1 - operation error
 *      2 - success, leave the page (successful update only)
 *      3 - success, stay in the page, and reinit it.
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
import { Articles } from '/imports/api/collections/articles/articles.js';
import bootbox from 'bootbox/dist/bootbox.all.min.js';
import '/imports/assets/dbope_status/dbope_status.js';
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

Template.collectPage.events({
    // delete the provided thought
    //  requiring a user confirmation
    'ronin.model.thought.delete'( ev, instance, thought ){
        bootbox.confirm(
            'You are about to delete the "'+thought.name+'" thought.<br />'+
            'Are you sure ?', function( ret ){
                if( ret ){
                    Meteor.call( 'thoughts.remove', thought._id, ( e, res ) => {
                        if( e ){
                            throwError({ type:e.error, message: e.reason });
                        } else {
                            throwSuccess( 'Thought successfully deleted' );
                        }
                    });
                }
            }
        );
        return false;
    },
    // insert or update the provided thought
    //  if a previous object already existed, then this is an update
    //  the page will be left if this was an update *and* it has been successful
    'ronin.model.thought.update'( ev, instance, thought ){
        Session.set( 'collect.dbope', DBOPE_WAIT );
        const obj = Session.get( 'collect.thought' );
        const id = obj ? obj._id : null;
        try {
            Articles.fn.check( id, thought );
        } catch( e ){
            console.log( e );
            throwError({ type:e.error, message: e.reason });
            return false;
        }
        if( obj ){
            // if nothing has changed, then does nothing
            if( Articles.fn.equal( obj, thought )){
                throwMessage({ type:'warning', message:'Nothing changed' });
                return false;
            }
            Meteor.call('thoughts.update', id, thought, ( e, res ) => {
                if( e ){
                    console.log( e );
                    throwError({ type:e.error, message: e.reason });
                    Session.set( 'collect.dbope', DBOPE_ERROR );
                } else {
                    throwSuccess( 'Thought successfully updated' );
                    Session.set( 'collect.thought', null );
                    Session.set( 'collect.dbope', DBOPE_LEAVE );
                }
            });
        } else {
            Meteor.call('thoughts.insert', thought, ( e, res ) => {
                if( e ){
                    console.log( e );
                    throwError({ type:e.error, message: e.reason });
                    Session.set( 'collect.dbope', DBOPE_ERROR );
                } else {
                    throwSuccess( 'Thought successfully inserted' );
                    Session.set( 'collect.thought', 'success' );  // force re-rendering
                    Session.set( 'collect.dbope', DBOPE_REINIT );
                }
            });
        }
        return false;
    }
});
