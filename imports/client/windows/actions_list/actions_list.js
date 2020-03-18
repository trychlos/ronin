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
import '/imports/client/components/plus_button/plus_button.js';
import '/imports/client/components/actions_tabs/actions_tabs.js';
import '/imports/client/components/window_badge/window_badge.js';
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
            projects: this.subscribe( 'articles.projects.all' ),
            topics: this.subscribe( 'topics.all' ),
            contexts: this.subscribe( 'contexts.all' )
            // no more used, kept as a future reference of reactive aggregate usage
            //counts: this.subscribe( 'articles.actions.status.count' )
        },
        spinner: null,
        tabs: {}
    };
    this.ronin.dict.set( 'window_ready', g.run.layout.get() === LYT_PAGE );
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
            //console.log( 'actionsList window_ready' );
        }
    });

    // create the spinner as soon as the window is ready
    this.autorun(() => {
        if( self.ronin.dict.get( 'window_ready' )){
            const $parent =
                g.run.layout.get() === LYT_PAGE ?
                    $( '.actionsList' ) :
                    $( '.actionsList' ).window( 'widget' );
            self.ronin.spinner = new Spinner().spin( $parent[0] );
            //console.log( 'actionsList spinner_start' );
        }
    });

    /* no more used, kept as a future reference of reactive aggregate usage
    // setup the count per status (aka per tab)
    this.autorun(() => {
        if( self.ronin.handles.counts.ready()){
            actionsByStatus.find().forEach( o => {
                self.ronin.dict.set( 'status_'+o._id, o.count );
            });
            console.log( 'actionsList count_per_tab' );
        }
    });
    */

    // child messaging
    //  update the tab's counts and the total count
    //  stop the spinner when currently displayed tab has sent its message
    $( '.actionsList' ).on( 'actions-tabs-ready', function( ev, o ){
        //console.log( ev );
        //console.log( o );
        //console.log( ev.type+' '+o.id );
        // update the counts
        self.ronin.dict.set( o.id+'_count', o.count );
        let total = self.ronin.dict.get( 'total_count' );
        total += o.count;
        self.ronin.dict.set( 'total_count', total )
        // maybe stop the spinner
        if( o.id === Session.get( 'actions.tab.name' ) && self.ronin.spinner ){
            self.ronin.spinner.stop();
            //console.log( 'actionsList spinner_stop' );
        }
        return false;
    });
});

Template.actionsList.helpers({
    // display current counts
    count(){
        const self = Template.instance();
        const total = self.ronin.dict.get( 'total_count' );
        const count = self.ronin.dict.get( Session.get( 'actions.tab.name' )+'_count' ) || 0;
        return count+'/'+total;
    }
});

Template.actionsList.events({
    // page layout
    'click .js-new'( ev, instance ){
        Template.actionsList.fn.doNew();
        return false;
    }
});
