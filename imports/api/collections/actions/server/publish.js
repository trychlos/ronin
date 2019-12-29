import { Meteor } from 'meteor/meteor';
import { Actions } from '../actions.js';

Meteor.publish('actions.all', function(){
    return Actions.find();
});
