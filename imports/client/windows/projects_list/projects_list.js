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
import { Counters } from '/imports/api/collections/counters/counters.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/plus_button/plus_button.js';
import '/imports/client/components/projects_tabs/projects_tabs.js';
import '/imports/client/components/window_badge/window_badge.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './projects_list.html';

Template.projectsList.fn = {
    doNew: function(){
        g.run.back = FlowRouter.current().route.name;
        const tab = Session.get( 'projects.tab.name' );
        const route = ( tab === 'gtd-review-projects-single' ? 'rt.actions.new' : 'rt.projects.new' );
        FlowRouter.go( route );
    }
};

Template.projectsList.onCreated( function(){
    //console.log( 'projectsList.onCreated' );
    this.ronin = {
        dict: new ReactiveDict(),
        spinner: null,
        tabs: {}
    };
    this.ronin.dict.set( 'total_count', 0 );
    this.ronin.dict.set( 'window_ready', g.run.layout.get() === LYT_PAGE );
});

Template.projectsList.onRendered( function(){
    //console.log( 'projectsList.onRendered' );
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
                                Template.projectsList.fn.doNew();
                            }
                        }
                    ],
                    group:  context.group,
                    title:  'Review projects'
                }
            });
            self.ronin.dict.set( 'window_ready', true );
        }
    });

    // create a new spinner as soon as the window is ready
    this.autorun(() => {
        if( self.ronin.dict.get( 'window_ready' )){
            let $parent = null;
            if( g.run.layout.get() === LYT_PAGE ){
                $parent = $( '.projectsList' );
            } else {
                $parent = $( '.projectsList' ).window( 'widget' );
            }
            if( $parent ){
                self.ronin.spinner = new Spinner().spin( $parent[0] );
            }
        }
    });

    // child messaging
    $( '.projectsList' ).on( 'projects-tabs-built', function( ev, o ){
        //console.log( ev );
        //console.log( o );
        if( self.ronin.spinner ){
            self.ronin.spinner.stop();
        }
        return false;
    });
    $( '.projectsList' ).on( 'projects-tree-count', function( ev, o ){
        //console.log( ev );
        //console.log( o );
        self.ronin.dict.set( o.tab, o.count );
        self.ronin.tabs[o.tab] = true;
        let total = 0;
        for( let prop in self.ronin.tabs ){
            if( self.ronin.tabs.hasOwnProperty( prop )){
                total += self.ronin.dict.get( prop );
            }
        }
        self.ronin.dict.set( 'total_count', total );
        return false;
    });
});

Template.projectsList.helpers({
    // display current counts
    count(){
        const self = Template.instance();
        const total = self.ronin.dict.get( 'total_count' );
        const tabcount = self.ronin.dict.get( Session.get( 'projects.tab.name' )) || 0;
        return tabcount+'/'+total;
    }
});

Template.projectsList.events({
    // page layout
    'click .js-new'( ev, instance ){
        Template.projectsList.fn.doNew();
        return false;
    }
});
