import { Meteor } from 'meteor/meteor';
import { Topics } from '../topics.js';

Meteor.publishTransformed('topics.all', function(){
    return Topics.find();
});
