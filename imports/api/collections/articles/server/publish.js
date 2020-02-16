import { Meteor } from 'meteor/meteor';
import { Articles } from '../articles.js';

Meteor.publish( 'articles.actions.all', function(){
    return Articles.find({ type: 'A', $or: [{ userId:null }, { userId:this.userId }]});
});

Meteor.publish( 'articles.maybe.all', function(){
    return Articles.find({ type: 'M', $or: [{ userId:null }, { userId:this.userId }]});
});

Meteor.publish( 'articles.projects.all', function(){
    return Articles.find({ type: 'P', $or: [{ userId:null }, { userId:this.userId }]});
});

Meteor.publish( 'articles.thoughts.all', function(){
    return Articles.find({ type: 'T', $or: [{ userId:null }, { userId:this.userId }]});
});
