/*
 * 'actionsList' window.
 *
 *  Display (at least) the list of actions.
 *  Each action has buttons:
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
 *      +-> <app layout layer> { gtdid, group, template }
 *              +-> <group layer> { gtdid, group, template }
 *                      |
 *                      +-> thoughtsList { gtdid, group, template }
 *                              +-> thoughts_list
 *                              +-> plus_button in page-based layout
 *                      |
 *                      +-> thoughtEdit { gtdid, group, template }
 *
 *  Parameters:
 *  - 'data': the layout context built in appLayout, and passed in by group layer.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/plus_button/plus_button.js';
import '/imports/client/components/actions_list/actions_list.js';
import '/imports/client/components/actions_tabs/actions_tabs.js';
import '/imports/client/components/window_badge/window_badge.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './actions_list.html';
import { Spinner } from 'spin.js';

Template.actionsList.fn = {
    actionNew: function(){
        g.run.back = FlowRouter.current().route.name;
        FlowRouter.go( 'action.new' );
    }
};

Template.actionsList.onCreated( function(){
    //console.log( 'actionsList.onCreated' );
    this.ronin = new ReactiveDict();
    this.ronin.set( 'actions', false );
    this.ronin.set( 'projects', false );
    this.ronin.set( 'topics', false );
    this.ronin.set( 'contexts', false );
    this.ronin.set( 'subscriptions_ready', false );
    this.ronin_handles = {
        actions: this.subscribe( 'articles.actions.all' ),
        projects: this.subscribe( 'articles.projects.all' ),
        topics: this.subscribe( 'topics.all' ),
        contexts: this.subscribe( 'contexts.all' ),
    }
});

Template.actionsList.onRendered( function(){
    //console.log( 'actionsList.onRendered' );
    const self = this;

    // create a new spinner, attaching it to the document, and starting it
    self.ronin_spinner = new Spinner().spin( document.getElementsByTagName( 'body' )[0] );

    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            const context = Template.currentData();
            $( '.'+context.template ).IWindowed({
                template: context.template,
                simone: {
                    buttons: [
                        {
                            text: "Close",
                            click: function(){
                                $.pubsub.publish( 'ronin.ui.actions.list.card.collapse-all' );
                                $().IWindowed.close( '.'+context.template );
                            }
                        },
                        {
                            text: "New",
                            click: function(){
                                Template.actionsList.fn.actionNew();
                            }
                        }
                    ],
                    group:  context.group,
                    title:  gtd.labelId( 'window', context.gtdid )
                }
            });
        }
    });

    // wait for subscriptions
    this.autorun(() => {
        if( self.ronin_handles.actions.ready()){
            self.ronin.set( 'actions', true );
        }
    });
    this.autorun(() => {
        if( self.ronin_handles.projects.ready()){
            self.ronin.set( 'projects', true );
        }
    });
    this.autorun(() => {
        if( self.ronin_handles.topics.ready()){
            self.ronin.set( 'topics', true );
        }
    });
    this.autorun(() => {
        if( self.ronin_handles.contexts.ready()){
            self.ronin.set( 'contexts', true );
        }
    });

    // at the end, stop the spinner
    this.autorun(() => {
        if( self.ronin.get( 'actions' ) && self.ronin.get( 'projects' ) && self.ronin.get( 'topics' ) && self.ronin.get( 'contexts' )){
            self.ronin.set( 'subscriptions_ready', true );
        }
    });
    this.autorun(() => {
        if( self.ronin.get( 'subscriptions_ready' )){
            self.ronin_spinner.stop();
        }
    });
});

Template.actionsList.helpers({
    actions(){
        return Articles.find({ type:'A' }, { sort:{ createdAt: -1 }});
    },
    count(){
        return Articles.find({ type:'A' }).count();
    }
});

Template.actionsList.events({
    // page layout
    'click .js-new'( ev, instance ){
        Template.actionsList.fn.actionNew();
        return false;
    }
});

Template.actionsList.onDestroyed( function(){
    //console.log( 'actionsList.onDestroyed' );
});
