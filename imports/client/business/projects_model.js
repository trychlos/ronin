/*
 * projects_model.js
 * To be imported at application layer level.
 *
 * Messages:
 *  - ronin.model.project.update
 */
import { Articles } from '/imports/api/collections/articles/articles.js';

// insert or update the provided project
//  or transform a thought into a project
//  if a previous object already existed, then this is an update
//  the page is left if this was an update *and* it has been successful
$.pubsub.subscribe( 'ronin.model.project.update', ( msg, o ) => {
    //console.log( msg );
    //console.log( o );
    o.edit._id = o.orig ? o.orig._id : null;
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
            messageWarning({
                type: 'warning',
                message: 'Nothing changed'
            });
            return false;
        }
        Meteor.call('projects.update', o.edit, ( e, res ) => {
            if( e ){
                console.log( e );
                messageError({ type:e.error, message:e.reason });
                if( o.cb ){
                    o.cb( o.data, { status: DBOPE_ERROR });
                }
            } else {
                if( o.orig.type === 'A' ){
                    messageSuccess( 'Action successfully transformed' );
                    $.pubsub.publish( 'ronin.ui.item.transformed', o.orig );
                } else if( o.orig.type === 'T' ){
                    messageSuccess( 'Thought successfully transformed' );
                    $.pubsub.publish( 'ronin.ui.item.transformed', o.orig );
                } else {
                    messageSuccess( 'Project successfully updated' );
                }
                $.pubsub.publish( 'ronin.ui.item.updated', o );
                if( o.cb ){
                    o.cb( o.data, { status: DBOPE_LEAVE });
                }
            }
        });
    } else {
        Meteor.call('projects.insert', o.edit, ( e, res ) => {
            if( e ){
                console.log( e );
                messageError({ type:e.error, message:e.reason });
                if( o.cb ){
                    o.cb( o.data, { status: DBOPE_ERROR });
                }
            } else {
                messageSuccess( 'Project successfully inserted' );
                if( o.cb ){
                    o.cb( o.data, { status: DBOPE_REINIT });
                }
            }
        });
    }
});
