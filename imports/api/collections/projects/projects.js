import { Mongo } from 'meteor/mongo';

export const Projects = new Mongo.Collection('projects');

Projects.schema = new SimpleSchema({
    code: {
        type: String,
        optional: true
    },
    name: {
        type: String
    },
    topic: {
        type: String,
        optional: true
    },
    purpose: {
        type: String,
        optional: true
    },
    vision: {
        type: String,
        optional: true
    },
    brainstorm: {
        type: String,
        optional: true
    },
    description: {
        type: String,
        optional: true
    },
    future: {
        type: Boolean,
        optional: true
    },
    ended: {
        type: Boolean,
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
    parent: {
        type: String,
        optional: true
    },
    select_order: {
        type: SimpleSchema.Integer,
        defaultValue: 9
    },
    notes: {
        type: String,
        optional: true
    }
});
Projects.attachSchema( Projects.schema );

Projects.attachBehaviour( 'timestampable', {
    createdBy: false,
    updatedBy: false
});

Projects.helpers({
});

Projects.fn = {
};
