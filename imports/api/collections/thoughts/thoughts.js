import { Mongo } from 'meteor/mongo';

export const Thoughts = new Mongo.Collection('thoughts');

Thoughts.schema = new SimpleSchema({
    name: {
        type: String,
    },
    description: {
        type: String,
        optional: true
    },
    topic: {
        type: String,
        optional: true
    },
});
Thoughts.attachSchema( Thoughts.schema );

Thoughts.attachBehaviour( 'timestampable', {
    createdBy: false,
    updatedBy: false
});

Thoughts.helpers({
});

Thoughts.fn = {
    check: function(){
        // nothing to do here
    },
    // check if two objects are the same
    // mainly used to prevent too many useless updates
    equal: function( a,b ){
        return
            ( a.name === b.name ) &&
            ( a.description === b.description ) &&
            ( a.topic === b.topic );
    }
};
