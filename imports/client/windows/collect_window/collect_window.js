/*
 * 'collectWindow' window.
 *  CRUD operations on thoughts.
 */
import { Thoughts } from '/imports/api/collections/thoughts/thoughts.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/client/components/thought_edit/thought_edit.js';
import '/imports/client/components/thoughts_list/thoughts_list.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './collect_window.html';

Template.collectWindow.onCreated( function(){
    this.subscribe('thoughts.all');
    this.subscribe('topics.all');
});

Template.collectWindow.onRendered( function(){
    // open the window if the manager has been intialized
    if( g[LYT_DESKTOP].taskbar.get()){
        $('div.collect-window').IWindowed({
            template:   'collectWindow',
            title:      'Collect thoughts'
        });
    }
});

Template.collectWindow.helpers({
    thoughts(){
        return Thoughts.find({}, { sort:{ createdAt: -1 }});
    }
});
