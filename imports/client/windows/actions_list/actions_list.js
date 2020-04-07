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
 *
 *  Session variables:
 *  - 'actions.tab.name': GTD identifier of the active tab.
 */
import { Spinner } from 'spin.js';
import { gtd } from '/imports/api/resources/gtd/gtd';
import '/imports/client/components/plus_button/plus_button.js';
import '/imports/client/components/actions_tabs/actions_tabs.js';
import '/imports/client/components/window_badge/window_badge.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './actions_list.html';

const ActionsByStatus = new Mongo.Collection( 'ActionsByStatus' );

Template.actionsList.fn = {
    newActivate: function(){
        gtd.activateId( 'gtd-process-action-new' );
    },
    newClasses: function(){
        return gtd.classesId( 'gtd-process-action-new' ).join( ' ' );
    }
};

Template.actionsList.onCreated( function(){
    //console.log( 'actionsList.onCreated' );
    this.ronin = {
        dict: new ReactiveDict(),
        $dom: null,
        handles: {
            projects: this.subscribe( 'articles.projects.all' ),
            topics: this.subscribe( 'topics.all' ),
            contexts: this.subscribe( 'contexts.all' )
            // no more used, kept as a future reference of reactive aggregate usage
            //counts: this.subscribe( 'articles.actions.status.count' )
        },
        spinner: null,
        timeout: null
    };
    this.ronin.dict.set( 'window_ready', Ronin.ui.runLayout() === R_LYT_PAGE );
    this.ronin.dict.set( 'total_count', 0 );
    this.ronin.dict.set( 'userId', Meteor.userId());
});

Template.actionsList.onRendered( function(){
    const self = this;
    const fn = Template.actionsList.fn;
    const context = Template.currentData();
    self.ronin.$dom = self.$( '.'+context.template );

    this.autorun(() => {
        if( Ronin.ui.layouts[R_LYT_WINDOW].taskbar.get() && !self.ronin.dict.get( 'window_ready' )){
            self.ronin.$dom.IWindowed({
                template: context.template,
                simone: {
                    buttons: [
                        {
                            text: "Close",
                            click: function(){
                                self.ronin.$dom.IWindowed( 'close' );
                            }
                        },
                        {
                            text: "New",
                            class: fn.newClasses(),
                            click: function(){
                                fn.newActivate();
                            }
                        }
                    ],
                    group: context.group,
                    title: 'Review actions'
                }
            });
            self.ronin.dict.set( 'window_ready', true );
        }
    });

    // create the spinner as soon as the window is ready
    this.autorun(() => {
        if( self.ronin.dict.get( 'window_ready' )){
            const $parent =
                Ronin.ui.runLayout() === R_LYT_PAGE ?
                    self.ronin.$dom :
                    self.ronin.$dom.window( 'widget' );
            self.ronin.spinner = new Spinner().spin( $parent[0] );
            self.ronin.timeout = Meteor.setTimeout(() => {
                if( self.ronin.spinner ){
                    self.ronin.spinner.stop();
                    self.ronin.spinner = null;
                }
            }, 15000 );
        }
    });

    /* no more used, kept as a future reference of reactive aggregate usage
    // setup the count per status (aka per tab)
    this.autorun(() => {
        if( self.ronin.handles.counts.ready()){
            ActionsByStatus.find().forEach( o => {
                self.ronin.dict.set( 'status_'+o._id, o.count );
            });
            console.log( 'actionsList count_per_tab' );
        }
    });
    */

    // activate the actions depending of the logged-in user
    this.autorun(() => {
        const userId = Meteor.userId();
        if( userId !== self.ronin.dict.get( 'userId' )){
            if( Ronin.ui.runLayout() === R_LYT_WINDOW ){
                self.ronin.$dom.IWindowed( 'buttonPaneResetClass', 1, fn.newClasses());
            }
            self.ronin.dict.set( 'userId', userId );
        }
    });

    // child messaging
    //  update the tab's counts and the total count
    //  object:
    //  - id: tab gtd id
    //  - status: action status
    //  - count: actions count
    //  stop the spinner when currently displayed tab has sent its message
    self.ronin.$dom.on( 'actions-tabs-ready', function( ev, o ){
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
            self.ronin.spinner = null;
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
        Template.actionsList.fn.newActivate();
        return false;
    }
});

Template.actionsList.onDestroyed( function(){
    if( this.ronin.timeout ){
        Meteor.clearTimeout( this.ronin.timeout );
        this.ronin.timeout = null;
    }
});
