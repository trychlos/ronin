import { Meteor } from 'meteor/meteor';

import { PriorityValues } from '../priority_values.js';

Meteor.methods({
    'priority_values.insert'( obj ){
        return PriorityValues.insert({
            name: obj.name
        });
    },
    'priority_values.remove'( id ){
        PriorityValues.remove( id );
    },
   'priority_values.update'( id, obj ){
        return PriorityValues.update( id, { $set: {
            name: obj.name
        }});
    },
});
