import { Meteor } from 'meteor/meteor';
import { Topics } from '../topics.js';

Meteor.publish('topics.all', function(){
    return Topics.find();
});
