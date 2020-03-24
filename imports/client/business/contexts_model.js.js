/*
 * contexts_model.js
 * To be imported at application layer level.
 *
 * Messages:
 *  - ronin.model.context.delete
 */
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import bootbox from 'bootbox/dist/bootbox.all.min.js';
import _ from 'lodash';

// delete the provided item
//  requiring a user confirmation
$.pubsub.subscribe( 'ronin.model.context.delete', ( msg, o ) => {
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
