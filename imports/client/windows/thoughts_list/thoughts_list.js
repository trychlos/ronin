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
import '/imports/client/components/thought_panel/thought_panel.js';
import '/imports/client/components/thoughts_list/thoughts_list.js';
import '/imports/client/components/window_badge/window_badge.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './thoughts_list.html';

Template.thoughtsList.fn = {
    runNew: function(){
        FlowRouter.go( 'collect.new' );
    }
};

Template.thoughtsList.onCreated( function(){
    //console.log( 'thoughtsList.onCreated' );
    this.subscribe( 'articles.thoughts.all' );
    this.subscribe( 'topics.all' );
});

Template.thoughtsList.onRendered( function(){
    //console.log( 'thoughtsList.onRendered' );
    // open the window if the manager has been initialized
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            $( '.thoughtsList' ).IWindowed({
                template: 'thoughtsList',
                simone: {
                    buttons: [
                        {
                            text: "Close",
                            click: function(){
                                console.log( this );
                                $( '.thoughtsList' ).IWindowed( 'close' );
                            }
                        },
                        {
                            text: "New",
                            click: function(){
                                console.log( this );
                                Template.thoughtsList.fn.runNew();
                            }
                        }
                    ],
                    group:  'collect',
                    title:  'List thoughts'
                }
            });
            //$( '.thoughtsList' ).IWindowed( 'addButton', '.js-new' );
        }
    })
});

Template.thoughtsList.helpers({
    thoughts(){
        return Articles.find({ type:'T' }, { sort:{ createdAt: -1 }});
    },
    count(){
        return Articles.find({ type:'T' }, { sort:{ createdAt: -1 }}).count();
    }
});

Template.thoughtsList.events({
    'click .js-new'( ev, instance ){
        Template.thoughtsList.fn.runNew();
        return false;
    }
});

Template.thoughtsList.onDestroyed( function(){
    console.log( 'thoughtsList.onDestroyed' );
});
