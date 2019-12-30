/*
 * 'collect' component.
 *  CRUD operations on thoughts.
 *  Embeds two sub-components:
 *  - thought_edit
 *  - thoughts_list.
 */
import { Meteor } from 'meteor/meteor';
import { Thoughts } from '/imports/api/collections/thoughts/thoughts.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/ui/components/thought_edit/thought_edit.js';
import '/imports/ui/components/thoughts_list/thoughts_list.js';
import './collect.html';

Template.collect.onCreated( function(){
    Meteor.subscribe('thoughts.all');
    Meteor.subscribe('topics.all');
});

Template.collect.helpers({
    thoughts_cursor(){
        return Thoughts.find({}, { sort:{ createdAt: -1 }});
    },
});
