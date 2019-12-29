import { Mongo } from 'meteor/mongo';

export const Actions = new Mongo.Collection('actions');

Actions.schema = new SimpleSchema({
    name: {
        type: String,
    },
    topic: {
        type: String,
        optional: true
    },
    context: {
        type: String,
        optional: true
    },
    outcome: {
        type: String,
        optional: true
    },
    description: {
        type: String,
        optional: true
    },
    status: {
        type: String,
        optional: true
    },
    startDate: {
        type: Date,
        optional: true
    },
    dueDate: {
        type: Date,
        optional: true
    },
    doneDate: {
        type: Date,
        optional: true
    },
    project: {
        type: String,
        optional: true
    },
    notes: {
        type: String,
        optional: true
    }
});
Actions.attachSchema( Actions.schema );

Actions.attachBehaviour( 'timestampable', {
    createdBy: false,
    updatedBy: false
});

Actions.helpers({
});

Actions.fn = {
};
