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
import { Spinner } from 'spin.js';
import { Articles } from '/imports/api/collections/articles/articles.js';
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/plus_button/plus_button.js';
import '/imports/client/components/actions_list/actions_list.js';
import '/imports/client/components/actions_tabs/actions_tabs.js';
import '/imports/client/components/text_badge/text_badge.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './actions_list.html';

const actionsByStatus = new Mongo.Collection( 'actionsByStatus' );

Template.actionsList.fn = {
    doNew: function(){
        g.run.back = FlowRouter.current().route.name;
        FlowRouter.go( 'rt.actions.new' );
    }
};

Template.actionsList.onCreated( function(){
    //console.log( 'actionsList.onCreated' );
    this.ronin = {
        dict: new ReactiveDict(),
        handles: {
            actions: this.subscribe( 'articles.actions.all' ),
            projects: this.subscribe( 'articles.projects.all' ),
            topics: this.subscribe( 'topics.all' ),
            contexts: this.subscribe( 'contexts.all' ),
            counts: this.subscribe( 'articles.actions.status.count' )
        },
        spinner: null
    };
    this.ronin.dict.set( 'window_ready', g.run.layout.get() === LYT_PAGE );
    this.ronin.dict.set( 'subscriptions_ready', false );
    this.ronin.dict.set( 'total_count', 0 );
});

Template.actionsList.onRendered( function(){
    //console.log( 'actionsList.onRendered' );
    const self = this;

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
                                Template.actionsList.fn.doNew();
                            }
                        }
                    ],
                    group:  context.group,
                    title:  'Review actions'
                }
            });
            self.ronin.dict.set( 'window_ready', true );
        }
    });

    // create the spinner as soon as the window is ready
    this.autorun(() => {
        if( self.ronin.dict.get( 'window_ready' )){
            let $parent = null;
            if( g.run.layout.get() === LYT_PAGE ){
                $parent = $( '.actionsList' );
            } else {
                $parent = $( '.actionsList' ).window( 'widget' );
            }
            if( $parent ){
                self.ronin.spinner = new Spinner().spin( $parent[0] );
            }
        }
    });

    // count total as soon as we got actions
    this.autorun(() => {
        if( self.ronin.handles.actions.ready()){
            self.ronin.dict.set( 'total_count', Articles.find({ type:'A' }).count());
        }
    });

    // setup the count per status (aka per tab)
    this.autorun(() => {
        if( self.ronin.handles.counts.ready()){
            actionsByStatus.find().forEach( o => {
                self.ronin.dict.set( 'status_'+o._id, o.count );
            });
        }
    });

    // wait for subscriptions
    this.autorun(() => {
        let ready = true;
        for( let prop in self.ronin.handles ){
            if( self.ronin.handles.hasOwnProperty( prop )){
                ready = ready && self.ronin.handles[prop].ready();
                if( !ready ){
                    break;
                }
            }
        }
        self.ronin.dict.set( 'subscriptions_ready', ready );
    });

    // stop the spinner when subscriptions are ready
    this.autorun(() => {
        if( self.ronin.dict.get( 'subscriptions_ready' )){
            self.ronin.spinner.stop();
        }
    });

    // reactively update the counts badge
    this.autorun(() => {
        const total = self.ronin.dict.get( 'total_count' );
        const status = gtd.statusId( Session.get( 'actions.tab.name' ));
        const tabcount = self.ronin.dict.get( 'status_'+status ) || 0;
        Session.set( 'text_badge.text', tabcount+'/'+total );
    });
});

Template.actionsList.helpers({
    actions(){
        return Articles.find({ type:'A' }, { sort:{ createdAt: -1 }});
    },
    // display current counts
    count(){
        return Session.get( 'text_badge.text' );
    }
});

Template.actionsList.events({
    // page layout
    'click .js-new'( ev, instance ){
        Template.actionsList.fn.doNew();
        return false;
    }
});

Template.actionsList.onDestroyed( function(){
    Session.set( 'text_badge.text', null );
});
