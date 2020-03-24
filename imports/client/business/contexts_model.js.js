/*
 * contexts_model.js
 * To be imported at application layer level.
 *
 * Messages:
 *  - ronin.model.context.delete
 */
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import { csfns } from '/imports/startup/both/collections-csfns.js';
import bootbox from 'bootbox/dist/bootbox.all.min.js';
import _ from 'lodash';

// delete the provided item
//  requiring a user confirmation
$.pubsub.subscribe( 'ronin.model.context.delete', ( msg, o ) => {
    try {
        csfns.check_editable( o );
    } catch( e ){
        console.log( e );
        messageError({ type:e.error, message:e.reason });
        return false;
    }
    bootbox.confirm(
        'You are about to delete the "'+o.name+'" context.<br />'+
        'Are you sure ?', function( ret ){
            if( ret ){
                Meteor.call( 'contexts.remove', o, ( e, res ) => {
                    if( e ){
                        messageError({ type:e.error, message:e.reason });
                    } else {
                        messageSuccess( 'Context successfully deleted' );
                        $.pubsub.publish( 'ronin.ui.item.deleted', o );
                    }
                });
            }
        }
    );
});

// insert or update the provided context
//  if a previous object already existed, then this is an update
//  the page is left if this was an update *and* it has been successful
$.pubsub.subscribe( 'ronin.model.context.update', ( msg, o ) => {
    //console.log( msg );
    //console.log( o );
    o.edit._id = o.orig ? o.orig._id : null;
    o.edit.userId = o.orig ? o.orig.userId : null;
    try {
        Contexts.fn.check( o.edit );
        csfns.takeOwnership( o.edit );
    } catch( e ){
        console.log( e );
        messageError({ type:e.error, message:e.reason });
        return false;
    }
    if( o.orig ){
        // if nothing has changed, then does nothing
        if( Contexts.fn.equal( o.orig, o.edit )){
            messageWarning( 'Nothing changed' );
            return false;
        }
        Meteor.call( 'contexts.update', o.edit, ( e, res ) => {
            if( e ){
                console.log( e );
                messageError({ type:e.error, message:e.reason });
                if( o.cb ){
                    o.cb( o.data, { status: DBOPE_ERROR });
                }
            } else {
                messageSuccess( 'Context successfully updated' );
                if( o.cb ){
                    o.cb( o.data, { status: DBOPE_LEAVE });
                }
                $.pubsub.publish( 'ronin.ui.item.updated', o );
            }
        });
    } else {
        Meteor.call( 'contexts.insert', o.edit, ( e, res ) => {
            if( e ){
                console.log( e );
                messageError({ type:e.error, message:e.reason });
                if( o.cb ){
                    o.cb( o.data, { status: DBOPE_ERROR });
                }
            } else {
                messageSuccess( 'Context successfully inserted' );
                if( o.cb ){
                    o.cb( o.data, { status: DBOPE_REINIT });
                }
            }
        });
    }
});
