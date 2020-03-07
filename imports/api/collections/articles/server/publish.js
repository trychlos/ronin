import { Meteor } from 'meteor/meteor';
import { ReactiveAggregate } from 'meteor/tunguska:reactive-aggregate';
import { Articles } from '../articles.js';

Meteor.publish( 'articles.actions.all', function(){
    return Articles.find({ type: 'A', $or: [{ userId:null }, { userId:Meteor.userId()}]});
});

Meteor.publish( 'articles.actions.status.count', function(){
    ReactiveAggregate( this, Articles, [
        { $match: { type:'A' }},
        { $group: { _id:'$status', count: { $sum:1 }}}
    ], {
        clientCollection: 'actionsStatus'
    });
});

Meteor.publish( 'articles.maybe.all', function(){
    return Articles.find({ type: 'M', $or: [{ userId:null }, { userId:Meteor.userId()}]});
});

Meteor.publish( 'articles.projects.all', function(){
    return Articles.find({ type: 'P', $or: [{ userId:null }, { userId:Meteor.userId()}]});
});

Meteor.publish( 'articles.thoughts.all', function(){
    return Articles.find({ type: 'T', $or: [{ userId:null }, { userId:Meteor.userId()}]});
});

Meteor.publish( 'articles.tree.all', function(){
    return Articles.find({ $and: [
        { $or:[{ type:'A' },{ type:'P' }]},
        { $or:[{ userId:null }, { userId:Meteor.userId()}]}
    ]});
});
