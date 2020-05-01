import { Meteor } from 'meteor/meteor';
import { ReactiveAggregate } from 'meteor/tunguska:reactive-aggregate';
import { Articles } from '../articles.js';

Meteor.publish( 'articles.one', function( id ){
    return Articles.find({ _id:id });
});

Meteor.publish( 'articles.actions.all', function(){
    return Articles.find({ type:R_OBJ_ACTION, $or: [{ userId:null }, { userId:this.userId }]});
});

Meteor.publish( 'articles.actions.status', function( status ){
    return Articles.find({ type:R_OBJ_ACTION, $or: [{ userId:null }, { userId:this.userId }], status:status });
});

Meteor.publish( 'articles.actions.status.count', function(){
    ReactiveAggregate( this, Articles, [
        { $match: { type:R_OBJ_ACTION, $or: [{ userId:null }, { userId:this.userId }]}},
        { $group: { _id:'$status', count: { $sum:1 }}}
    ], {
        clientCollection: 'ActionsByStatus'
    });
});

Meteor.publish( 'articles.maybe.all', function(){
    return Articles.find({ type:R_OBJ_MAYBE, $or: [{ userId:null }, { userId:this.userId }]});
});

Meteor.publish( 'articles.projects.all', function(){
    return Articles.find({ type:R_OBJ_PROJECT, $or: [{ userId:null }, { userId:this.userId }]});
});

Meteor.publish( 'articles.thoughts.all', function(){
    return Articles.find({ type:R_OBJ_THOUGHT, $or: [{ userId:null }, { userId:this.userId }]});
});

Meteor.publish( 'articles.tree.all', function(){
    return Articles.find({ $and: [
        { $or:[{ type:R_OBJ_ACTION },{ type:R_OBJ_PROJECT }]},
        { $or:[{ userId:null }, { userId:this.userId }]}
    ]});
});
