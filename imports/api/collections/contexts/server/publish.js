import { Meteor } from 'meteor/meteor';
import { Contexts } from '../contexts.js';

Meteor.publish('contexts.all', function(){
    return Contexts.find();
});
