import { Meteor } from 'meteor/meteor';
import { TimeValues } from '../time_values.js';

Meteor.publish('time_values.all', function(){
    return TimeValues.find();
});
