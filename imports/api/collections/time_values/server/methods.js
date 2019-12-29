import { Meteor } from 'meteor/meteor';

import { TimeValues } from '../time_values.js';

Meteor.methods({
    'time_values.insert'( obj ){
        return TimeValues.insert({
            name: obj.name
        });
    },
    'time_values.remove'( id ){
        TimeValues.remove( id );
    },
   'time_values.update'( id, obj ){
        return TimeValues.update( id, { $set: {
            name: obj.name
        }});
    },
});
