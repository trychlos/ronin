import { Meteor } from 'meteor/meteor';
import { Contexts } from '../contexts.js';

Meteor.publishTransformed('contexts.all', function(){
    return Contexts.find();
});
