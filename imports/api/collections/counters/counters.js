import { Mongo } from 'meteor/mongo';

export const Counters = new Mongo.Collection('counters');

Counters.schema = new SimpleSchema({
    name: {
        type: String,
    },
    nid: {
        type: SimpleSchema.Integer,
        optional: true
    },
    tabid: {
        type: String,
        optional: true
    },
    value: {
        type: String,
        optional: true
    }
});
Counters.attachSchema( Counters.schema );

Counters.attachBehaviour( 'timestampable', {
    createdBy: false,
    updatedBy: false
});

Counters.helpers({
});

Counters.fn = {
};
