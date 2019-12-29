/*
 * 'setup_topics' component.
 *  Edit, create, delete and list topics.
 *  This component itself embeds two other UI components:
 *  - topic_edit
 *  - topics_list.
 *  Session variables:
 *  - 'setup.topics.obj': the edited object, selected in topics_list.
 */
import { Meteor } from 'meteor/meteor';
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/ui/components/topic_edit/topic_edit.js';
import '/imports/ui/components/topics_list/topics_list.js';
import './setup_topics.html';

Template.setup_topics.onCreated( function(){
    Meteor.subscribe('topics.all');
});

Template.setup_topics.helpers({
    topics_cursor(){
        return Topics.find({}, { sort:{ createdAt: -1 }});
    },
});

Template.setup_topics.events({
});
