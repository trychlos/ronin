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
    }
});
Delegates.attachSchema( Delegates.schema );

Delegates.attachBehaviour( 'timestampable', {
    createdBy: false,
    updatedBy: false
});
