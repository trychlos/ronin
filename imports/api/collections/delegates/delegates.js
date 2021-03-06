/*
 * Delegates
 *
 * This is the collection of delegates of an action.
 */
import { Mongo } from 'meteor/mongo';

export const Delegates = new Mongo.Collection( 'delegates' );

Delegates.schema = new SimpleSchema({
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
Delegates.attachSchema( Delegates.schema );

Delegates.attachBehaviour( 'timestampable', {
    createdBy: false,
    updatedBy: false
});

/*
 * Delegates.fn are functions which may be called both from the client
 *  and on the server.
 *
 * See server/sofns.js for server-only functions.
 * See server/methods.js for server functions remotely callable from the client
 *  (aka Meteor RPC).
 */
Delegates.fn = {
    check: function( o ){
        csfns.check_object( o );
        csfns.check_editable( o );
        csfns.check_name( o );
        Delegates.schema.validate( o );
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
