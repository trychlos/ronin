/*
 * 'mobile_collect' component.
 *  Collect thoughts (mobile version).
 */
import { Thoughts } from '/imports/api/collections/thoughts/thoughts.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/client/components/thought_edit/thought_edit.js';
import '/imports/client/components/thoughts_list/thoughts_list.js';
import './mobile_collect.html';

Template.mobile_collect.onCreated( function(){
    this.subscribe('thoughts.all');
    this.subscribe('topics.all');
});

Template.mobile_collect.onRendered( function(){
});

Template.mobile_collect.helpers({
    thoughts(){
        return Thoughts.find({}, { sort:{ createdAt: -1 }});
    }
});
