import { Meteor } from 'meteor/meteor';
import { Counters } from '../counters.js';

Meteor.publish('counters.all', function(){
    return Counters.find();
});
