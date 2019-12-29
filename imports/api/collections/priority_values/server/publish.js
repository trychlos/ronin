import { Meteor } from 'meteor/meteor';
import { PriorityValues } from '../priority_values.js';

Meteor.publish('priority_values.all', function(){
    return PriorityValues.find();
});
