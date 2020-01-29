/*
 * 'collectWindow' window.
 *  CRUD operations on thoughts.
 *
 *  This window is used both for desktop and touch layouts, with the same simple
 *  internal layout:
 *  - an edition part on the top, managed by the 'thought_edit' template,
 *  - a list part on the bottom, managed by the 'thoughts_list' template.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/client/components/plus_button/plus_button.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './collect_window.html';

Template.collectWindow.onCreated( function(){
    this.subscribe( 'articles.thoughts.all' );
    this.subscribe( 'topics.all' );
});

Template.collectWindow.onRendered( function(){
    // open the window if the manager has been intialized
    if( g[LYT_WINDOW].taskbar.get()){
        $('div.collect-window').IWindowed({
            template:   'collectWindow',
            title:      'Collect thoughts'
        });
    }
});

Template.collectWindow.helpers({
    panel(){
        return Session.get( 'panel' );
    },
    thoughts(){
        return Articles.find({ type:'T' }, { sort:{ createdAt: -1 }});
    }
});

Template.collectWindow.events({
    'click .js-new'( ev, instance ){
        Session.set( 'collect.thought', null );
        FlowRouter.go( 'collect.edit' );
        return false;
    }
});

Template.collectWindow.onDestroyed( function(){
    //console.log( 'collectWindow:onDestroyed()' );
});
