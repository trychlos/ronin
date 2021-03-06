/*
 * actions_model.js
 * To be imported at application layer level.
 *
 * Messages:
 *  - ronin.model.action.done.toggle
 *  - ronin.model.action.update
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import { csfns } from '/imports/startup/both/collections-csfns.js';

// toggle the 'done' status of the provided action
$.pubsub.subscribe( 'ronin.model.action.done.toggle', ( msg, o ) => {
    try {
        Articles.fn.check( o.action, [ R_OBJ_ACTION ]);
        csfns.takeOwnership( o.action );
    } catch( e ){
        console.log( e );
        messageError({ type:e.error, message:e.reason });
        return false;
    }
    if( o.action.doneDate || o.action.status === 'don' ){
        Articles.fn.actionDoneClear( o.action );
    } else {
        Articles.fn.actionDoneSet( o.action );
    }
    Meteor.call( 'actions.update', o.action, ( e, res ) => {
        if( e ){
            messageError({ type:e.error, message: e.reason });
        } else {
            messageSuccess( 'Action successfully toggled' );
        }
    });
});

// insert or update the provided action
//  or transform a thought into an action
//  if a previous object already existed, then this is an update
//  the page is left if this was an update *and* it has been successful
$.pubsub.subscribe( 'ronin.model.action.update', ( msg, o ) => {
    //console.log( msg );
    //console.log( o );
    o.edit._id = o.orig ? o.orig._id : null;
    o.edit.userId = o.orig ? o.orig.userId : null;
    try {
        Articles.fn.check( o.edit, [ R_OBJ_ACTION ]);
        csfns.takeOwnership( o.edit );
    } catch( e ){
        console.log( e );
        messageError({ type:e.error, message:e.reason });
        return false;
    }
    if( o.orig ){
        // if nothing has changed, then does nothing
        //console.log( msg+' equal='+Articles.fn.equal( o.orig, o.edit ));
        if( Articles.fn.equal( o.orig, o.edit )){
            messageWarning( 'Nothing changed' );
            return false;
        }
        Meteor.call('actions.update', o.edit, ( e, res ) => {
            if( e ){
                console.log( e );
                messageError({ type:e.error, message:e.reason });
                if( o.cb ){
                    o.cb( o.data, { status: DBOPE_ERROR });
                }
            } else {
                if( o.orig.type === R_OBJ_THOUGHT ){
                    messageSuccess( 'Thought successfully transformed' );
                    $.pubsub.publish( 'ronin.ui.item.transformed', o.orig );
                } else {
                    messageSuccess( 'Action successfully updated' );
                }
                if( o.cb ){
                    o.cb( o.data, { status: DBOPE_LEAVE });
                }
                $.pubsub.publish( 'ronin.ui.item.updated', o );
            }
        });
    } else {
        Meteor.call('actions.insert', o.edit, ( e, res ) => {
            if( e ){
                console.log( e );
                messageError({ type:e.error, message:e.reason });
                if( o.cb ){
                    o.cb( o.data, { status: DBOPE_ERROR });
                }
            } else {
                messageSuccess( 'Action successfully inserted' );
                if( o.cb ){
                    o.cb( o.data, { status: DBOPE_REINIT });
                }
            }
        });
    }
});
