import { Meteor } from 'meteor/meteor';
import { References } from '../references.js';

Meteor.publish('references.all', function(){
    return References.find();
});
