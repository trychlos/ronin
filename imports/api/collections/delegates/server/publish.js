import { Meteor } from 'meteor/meteor';
import { Delegates } from '../delegates.js';

Meteor.publish('delegates.all', function(){
    return Delegates.find();
});
