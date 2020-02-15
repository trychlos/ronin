/*
 * thoughts_model.js
 * To be imported at group layer level.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import bootbox from 'bootbox/dist/bootbox.all.min.js';

// delete the provided thought
//  requiring a user confirmation
$.pubsub.subscribe( 'ronin.model.thought.delete', ( msg, o ) => {
    bootbox.confirm(
        'You are about to delete the "'+o.thought.name+'" thought.<br />'+
        'Are you sure ?', function( ret ){
            if( ret ){
                Meteor.call( 'thoughts.remove', o.thought._id, ( e, res ) => {
                    if( e ){
                        throwError({ type:e.error, message:e.reason });
                    } else {
                        throwSuccess( 'Thought successfully deleted' );
                    }
                });
            }
        }
    );
});

// take ownership of the tought
$.pubsub.subscribe( 'ronin.model.thought.ownership', ( msg, o ) => {
    Meteor.call( 'articles.ownership', o.thought._id, ( e, res ) => {
        if( e ){
            throwError({ type:e.error, message:e.reason });
        } else {
            throwSuccess( 'Ownership successfully taken' );
        }
    });
});

// insert or update the provided thought
//  if a previous object already existed, then this is an update
//  the page is left if this was an update *and* it has been successful
$.pubsub.subscribe( 'ronin.model.thought.update', ( msg, o ) => {
    //console.log( msg );
    //console.log( o.orig );
    //console.log( o.edit );
    Session.set( 'collect.dbope', DBOPE_WAIT );
    const id = o.orig ? o.orig._id : null;
    try {
        Articles.fn.check( id, o.edit );
    } catch( e ){
        console.log( e );
        throwError({ type:e.error, message:e.reason });
        return false;
    }
    if( o.orig ){
        // if nothing has changed, then does nothing
        if( Articles.fn.equal( o.orig, o.edit )){
            throwMessage({ type:'warning', message:'Nothing changed' });
            return false;
        }
        Meteor.call('thoughts.update', id, o.edit, ( e, res ) => {
            if( e ){
                console.log( e );
                throwError({ type:e.error, message:e.reason });
                Session.set( 'collect.dbope', DBOPE_ERROR );
            } else {
                throwSuccess( 'Thought successfully updated' );
                Session.set( 'collect.dbope', DBOPE_LEAVE );
            }
        });
    } else {
        Meteor.call('thoughts.insert', o.edit, ( e, res ) => {
            if( e ){
                console.log( e );
                throwError({ type:e.error, message:e.reason });
                Session.set( 'collect.dbope', DBOPE_ERROR );
            } else {
                throwSuccess( 'Thought successfully inserted' );
                Session.set( 'collect.thought', 'success' );  // force re-rendering
                Session.set( 'collect.dbope', DBOPE_REINIT );
            }
        });
    }
});
