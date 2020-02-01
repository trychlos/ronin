/*
 * 'actionsList' window.
 *
 *  Display (at least) the list of actions.
 *  Each action as buttons:
 *  - to update/delete the action
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
 *              +-> reviewPage { gtd, window }
 *                      |
 *                      +-> actionsList { gtd }
 *                              +-> action_panel in window-based layout
 *                              +-> actions_list
 *                              +-> plus_button in page-based layout
 *                      |
 *                      +-> actionEdit { gtd }
 *
 *  Parameters:
 *  - 'gtd': identifier of the features group item.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/client/components/plus_button/plus_button.js';
import '/imports/client/components/action_panel/action_panel.js';
import '/imports/client/components/actions_list/actions_list.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './actions_list.html';

Template.actionsList.onCreated( function(){
    this.subscribe( 'articles.actions.all' );
    this.subscribe( 'topics.all' );
    this.subscribe( 'contexts.all' );
});

Template.actionsList.onRendered( function(){
    // open the window if the manager has been intialized
    if( g[LYT_WINDOW].taskbar.get()){
        $('div.collect-window').IWindowed({
            template:   'actionsList',
            title:      'Review actions'
        });
    }
});

Template.actionsList.helpers({
    actions(){
        return Articles.find({ type:'A' }, { sort:{ createdAt: -1 }});
    }
});

Template.actionsList.events({
    // emitted from actions_list_item:
    //  close all items
    'ronin.ui.actions.list.card.collapse'( event, instance ){
        //console.log( 'thoughts_list ronin.thoughts.list.card.collapse' );
        $( '.actions-list-item' ).removeClass( 'opened-card' );
        Session.set( 'review.opened', null );
    },
    'click .js-new'( ev, instance ){
        $( event.target ).trigger( 'ronin.ui.actions.list.card.collapse' );
        Session.set( 'review.action', null );
        FlowRouter.go( 'action.new' );
        return false;
    }
});
