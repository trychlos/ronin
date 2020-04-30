/*
 * Contexts
 *
 * This is the context into which an action is to be executed.
 *
 * As of v20.03.xx.x, contexts are common to each and every user.
 * Any logged-in user may create a new context, but only an admin (role to be
 * defined) could delete them.
 *
 * The user interface takes care of proposing a default 'None' context.
 */
import { Mongo } from 'meteor/mongo';
import { csfns } from '/imports/startup/both/collections-csfns.js';

export const Contexts = new Mongo.Collection('contexts');

Contexts.schema = new SimpleSchema({
    name: {
        type: String
    },
    description: {
        type: String,
        optional: true
    },
    userId: {
        type: String,
        optional: true
    },
    _id: {
        type: String,
        optional: true
    },
    xxxxxx: {   // unused key to be sure we always have something to unset
        type: String,
        optional: true
    }
});
Contexts.attachSchema( Contexts.schema );

Contexts.attachBehaviour( 'timestampable', {
    createdBy: false,
    updatedBy: false
});

/*
 * Contexts.fn are functions which may be called both from the client
 *  and on the server.
 *
 * See server/sofns.js for server-only functions.
 * See server/methods.js for server functions remotely callable from the client
 *  (aka Meteor RPC).
 */
Contexts.fn = {
    check: function( o ){
        csfns.check_object( o );
        csfns.check_editable( o );
        csfns.check_name( o );
        Contexts.schema.validate( o );
    },
    /* Test if two objects are equals
    *  mainly used to prevent too many useless updates
    *  Callable both from client and server, but mainly used from the client.
    *  Doesn't modify any object.
    *  Doesn't throw any exception, but returns true (resp. false) if the provided
    *  objects are equal (resp. different).
    */
    equal: function( a, b ){
        return csfns.equalStrs( a.name, b.name ) &&
                csfns.equalStrs( a.description, b.description );
    }
};

Contexts.helpers({
    // works but rather useless
    /*
    isDeletable(){
        return this.st_useCount === 0;
    }
    */
});
