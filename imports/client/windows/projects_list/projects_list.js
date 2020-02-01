/*
 * 'projectsList' window.
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
 *                      +-> projectsList { gtd }
 *                              +-> project_panel in window-based layout
 *                              +-> projects_list
 *                              +-> plus_button in page-based layout
 *                      |
 *                      +-> projectEdit { gtd }
 *
 *  Parameters:
 *  - 'gtd': identifier of the features group item.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/client/components/plus_button/plus_button.js';
//import '/imports/client/components/action_edit/action_edit.js';
//import '/imports/client/components/actions_list/actions_list.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './projects_list.html';

Template.projectsList.onCreated( function(){
    this.subscribe( 'articles.projects.all' );
    this.subscribe( 'topics.all' );
    this.subscribe( 'contexts.all' );
});

Template.projectsList.onRendered( function(){
    // open the window if the manager has been intialized
    if( g[LYT_WINDOW].taskbar.get()){
        $('div.collect-window').IWindowed({
            template:   'projectsList',
            title:      'Review projects'
        });
    }
});

Template.projectsList.helpers({
    projects(){
        return Articles.find({ type:'P' }, { sort:{ createdAt: -1 }});
    }
});

Template.projectsList.events({
    /*
    // emitted from thoughts_list_item:
    //  close all items
    'ronin.ui.thoughts.list.card.collapse'( event, instance ){
        //console.log( 'thoughts_list ronin.thoughts.list.card.collapse' );
        $( '.thoughts-list-item' ).removeClass( 'opened-card' );
        Session.set( 'collect.opened', null );
    },
    */
    'click .js-new'( ev, instance ){
        $( event.target ).trigger( 'ronin.ui.projects.list.card.collapse' );
        FlowRouter.go( 'project.new' );
        return false;
    }
});