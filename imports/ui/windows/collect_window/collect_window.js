/*
 * 'collectWindow' window.
 *  CRUD operations on thoughts.
 */
import { Thoughts } from '/imports/api/collections/thoughts/thoughts.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/ui/components/thought_edit/thought_edit.js';
import '/imports/ui/components/thoughts_list/thoughts_list.js';
import '/imports/ui/interfaces/iwindowed/iwindowed.js';
import './collect_window.html';

Template.collectWindow.onCreated( function(){
    this.subscribe('thoughts.all');
    this.subscribe('topics.all');
});

Template.collectWindow.onRendered( function(){
    this.autorun(() => {
        if( g.taskbar.get()){
            $('div.collect-window').iWindowed({
                id:    'collectWindow',
                title: 'Collect thoughts'
            });
        }
    });
});

Template.collectWindow.helpers({
    thoughts(){
        return Thoughts.find({}, { sort:{ createdAt: -1 }});
    }
});
