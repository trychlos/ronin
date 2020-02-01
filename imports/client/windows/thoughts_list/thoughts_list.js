/*
 * 'thoughtsList' window.
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
 *      +-> pageLayout { gtd, page, window }
 *              +-> collectPage { gtd, window }
 *                      |
 *                      +-> thoughtsList { gtd }
 *                              +-> thought_panel in window-based layout
 *                              +-> thoughts_list
 *                              +-> plus_button in page-based layout
 *                      |
 *                      +-> thoughtEdit { gtd }
 *
 *  Parameters:
 *  - 'gtd': identifier of the features group item.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import '/imports/client/components/plus_button/plus_button.js';
import '/imports/client/components/thoughts_list/thoughts_list.js';
import '/imports/client/components/thought_panel/thought_panel.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './thoughts_list.html';

Template.thoughtsList.onCreated( function(){
    this.subscribe( 'articles.thoughts.all' );
    this.subscribe( 'topics.all' );
});

Template.thoughtsList.onRendered( function(){
    // open the window if the manager has been intialized
    if( g[LYT_WINDOW].taskbar.get()){
        $('div.collect-window').IWindowed({
            template:   'collectList',
            title:      'Collect thoughts'
        });
    }
});

Template.thoughtsList.helpers({
    thoughts(){
        return Articles.find({ type:'T' }, { sort:{ createdAt: -1 }});
    }
});

Template.thoughtsList.events({
    // emitted from thoughts_list_item:
    //  close all items
    'ronin.ui.thoughts.list.card.collapse'( event, instance ){
        //console.log( 'thoughts_list ronin.thoughts.list.card.collapse' );
        $( '.thoughts-list-item' ).removeClass( 'opened-card' );
        Session.set( 'collect.opened', null );
    },
    'click .js-new'( ev, instance ){
        $( event.target ).trigger( 'ronin.ui.thoughts.list.card.collapse' );
        FlowRouter.go( 'collect.new' );
        return false;
    }
});

Template.thoughtsList.onDestroyed( function(){
    //console.log( 'collectWindow:onDestroyed()' );
});
