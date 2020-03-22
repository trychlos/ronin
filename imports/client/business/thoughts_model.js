/*
 * thoughts_model.js
 * To be imported at application layer level.
 *
 *  Thoughts business layer involves one main operation: thought update.
 *  This operation handles both creating a new thought, and updating an
 *  existing one.
 *  Other thought operations, e.g. take ownership, are banalized and
 *  handled at the article level.
 *
 * Messages:
 *  - ronin.model.thought.update
 */
import { Articles } from '/imports/api/collections/articles/articles.js';

// insert or update the provided thought
//  if a previous object already existed, then this is an update
//  the page is left if this was an update *and* it has been successful
$.pubsub.subscribe( 'ronin.model.thought.update', ( msg, o ) => {
    //console.log( msg );
    //console.log( o );
    const id = o.orig ? o.orig._id : null;
    o.edit.userId = o.orig ? o.orig.userId : null;
    try {
        Articles.fn.check( o.edit );
        Articles.fn.takeOwnership( o.edit );
    } catch( e ){
        console.log( e );
        messageError({ type:e.error, message:e.reason });
        return false;
    }
    if( o.orig ){
        // if nothing has changed, then does nothing
        if( Articles.fn.equal( o.orig, o.edit )){
            messageWarning( 'Nothing changed' );
            return false;
        }
        Meteor.call('thoughts.update', id, o.edit, ( e, res ) => {
            if( e ){
                console.log( 'thoughts.update Meteor.call() returned exception' );
                console.log( e );
                messageError({ type:e.error, message:e.reason });
                if( o.cb ){
                    o.cb( o.data, { status: DBOPE_ERROR });
                }
            } else {
                messageSuccess( 'Thought successfully updated' );
                if( o.cb ){
                    o.cb( o.data, { status: DBOPE_LEAVE });
                }
            }
        });
    } else {
        Meteor.call('thoughts.insert', o.edit, ( e, res ) => {
            if( e ){
                console.log( 'thoughts.insert Meteor.call() returned exception' );
                console.log( e );
                messageError({ type:e.error, message:e.reason });
                if( o.cb ){
                    o.cb( o.data, { status: DBOPE_ERROR });
                }
            } else {
                messageSuccess( 'Thought successfully inserted' );
                if( o.cb ){
                    o.cb( o.data, { status: DBOPE_REINIT });
                }
            }
        });
    }
});
