import { Meteor } from 'meteor/meteor';
import { Counters } from '../counters.js';

Meteor.publish('counters.all', function(){
    return Counters.find();
});

// Display the root nodes of projects_tree
Meteor.publish('counters.root.tree', function(){
    return Counters.find({ name:'root' },{ sort: { nid: 1 }});
});
