/*
 * 'collectList' window.
 *
 *  Display (at least) the list of thoughts.
 *  Each thought as buttons:
 *  - to create/update/delete the thought
 *  - or to transform it to action, project or maybe.
 *
 *  pageLayout:
 *  - each panel has its own window which comes on the top of the previous one.
 *
 *  windowLayout:
 *  - each panel may be opened in its own window.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> pageLayout { group, page, window }
 *              +-> collectPage { group, window }
 *                      +-> collectList { group }
 *                              +-> thought_edit in window-based layout
 *                              +-> thoughts_list
 *                              +-> plus_button in page-based layout
 *                      +-> collectEdit { group }
 *
 *  Parameters:
 *  - 'group': identifier of the features group.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/client/components/plus_button/plus_button.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './collect_list.html';

Template.collectList.onCreated( function(){
    this.subscribe( 'articles.thoughts.all' );
    this.subscribe( 'topics.all' );
});

Template.collectList.onRendered( function(){
    // open the window if the manager has been intialized
    if( g[LYT_WINDOW].taskbar.get()){
        $('div.collect-window').IWindowed({
            template:   'collectList',
            title:      'Collect thoughts'
        });
    }
});

Template.collectList.helpers({
    thoughts(){
        return Articles.find({ type:'T' }, { sort:{ createdAt: -1 }});
    }
});

Template.collectList.events({
    // emitted from thoughts_list_item:
    //  close all items
    'ronin.thoughts.list.card.collapse'( event, instance ){
        //console.log( 'thoughts_list ronin.thoughts.list.card.collapse' );
        $( '.thoughts-list-item' ).removeClass( 'opened-card' );
        Session.set( 'collect.opened', null );
    },
    'click .js-new'( ev, instance ){
        $( event.target ).trigger( 'ronin.thoughts.list.card.collapse' );
        FlowRouter.go( 'collect.new' );
        return false;
    }
});

Template.collectList.onDestroyed( function(){
    //console.log( 'collectWindow:onDestroyed()' );
});
