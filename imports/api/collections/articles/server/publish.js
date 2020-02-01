import { Meteor } from 'meteor/meteor';
import { Articles } from '../articles.js';

Meteor.publish( 'articles.all', function(){
    return Articles.find();
});

Meteor.publish( 'articles.actions.all', function(){
    return Articles.find({ type: 'A' });
});

Meteor.publish( 'articles.maybe.all', function(){
    return Articles.find({ type: 'M' });
});

Meteor.publish( 'articles.projects.all', function(){
    return Articles.find({ type: 'P' });
});

Meteor.publish( 'articles.thoughts.all', function(){
    return Articles.find({ type: 'T' });
});
