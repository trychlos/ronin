import { Meteor } from 'meteor/meteor';

import { ActionStatus } from '../action_status.js';

Meteor.methods({
    'action_status.insert'( obj ){
        return ActionStatus.insert({
            name: obj.name
        });
    },
    'action_status.remove'( id ){
        ActionStatus.remove( id );
    },
   'action_status.update'( id, obj ){
        return ActionStatus.update( id, { $set: {
            name: obj.name
        }});
    },
});
