/*
 * References
 *
 * This is the collection of reference items.
 */
import { Mongo } from 'meteor/mongo';

export const References = new Mongo.Collection( 'references' );

References.schema = new SimpleSchema({
    name: {
        type: String
    },
    description: {
        type: String,
        optional: true
    }
});
References.attachSchema( References.schema );

References.attachBehaviour( 'timestampable', {
    createdBy: false,
    updatedBy: false
});
