/*
 * actions_model.js
 * To be imported at application layer level.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';

// toggle the 'done' status of the provided action
$.pubsub.subscribe( 'ronin.model.action.done.toggle', ( msg, o ) => {
    Articles.fn.doneToggle( o.action );
});

// insert or update the provided action
//  or transform a thought into an action
//  if a previous object already existed, then this is an update
//  the page is left if this was an update *and* it has been successful
$.pubsub.subscribe( 'ronin.model.action.update', ( msg, o ) => {
    //console.log( msg );
    //console.log( o );
    Session.set( 'action.dbope', DBOPE_WAIT );
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
        //console.log( msg+' equal='+Articles.fn.equal( o.orig, o.edit ));
        o.edit.userId = o.orig.userId;
        if( Articles.fn.equal( o.orig, o.edit )){
            throwMessage({ type:'warning', message:'Nothing changed' });
            return false;
        }
        Meteor.call('actions.update', id, o.edit, ( e, res ) => {
            if( e ){
                console.log( e );
                throwError({ type:e.error, message:e.reason });
                Session.set( 'action.dbope', DBOPE_ERROR );
            } else {
                if( o.orig.type === 'T' ){
                    throwSuccess( 'Thought successfully transformed' );
                    $.pubsub.publish( 'ronin.ui.item.transformed', o.orig );
                } else {
                    throwSuccess( 'Action successfully updated' );
                }
                $.pubsub.publish( 'ronin.ui.item.updated', o );
                Session.set( 'action.dbope', DBOPE_LEAVE );
            }
        });
    } else {
        Meteor.call('actions.insert', o.edit, ( e, res ) => {
            if( e ){
                console.log( e );
                throwError({ type:e.error, message:e.reason });
                Session.set( 'action.dbope', DBOPE_ERROR );
            } else {
                throwSuccess( 'Action successfully inserted' );
                Session.set( 'action.dbope', DBOPE_REINIT );
            }
        });
    }
});
