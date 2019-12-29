import { Meteor } from 'meteor/meteor';
import { ActionStatus } from '../action_status.js';

Meteor.publish('action_status.all', function(){
    return ActionStatus.find();
});
