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
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/plus_button/plus_button.js';
import '/imports/client/components/projects_footer/projects_footer.js';
import '/imports/client/components/projects_tabs/projects_tabs.js';
import '/imports/client/components/window_badge/window_badge.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './projects_list.html';

Template.projectsList.fn = {
    collapseActivate: function( instance ){
        const tabsView = instance.ronin.tabsView;
        const tab = Session.get( 'projects.tab.name' );
        const $tree = Template.projects_tabs.fn.getTabTree( tabsView, tab );
        if( $tree ){
            $tree.trigger( 'projects-tree-collapse' );
        }
    },
    collapseClass: function(){
    },
    dumpActivate: function( instance ){
        const tabsView = instance.ronin.tabsView;
        const tab = Session.get( 'projects.tab.name' );
        const $tree = Template.projects_tabs.fn.getTabTree( tabsView, tab );
        if( $tree ){
            $tree.trigger( 'projects-tree-dump' );
        }
    },
    dumpClass: function(){
    },
    expandActivate: function( instance ){
        const tabsView = instance.ronin.tabsView;
        const tab = Session.get( 'projects.tab.name' );
        const $tree = Template.projects_tabs.fn.getTabTree( tabsView, tab );
        if( $tree ){
            $tree.trigger( 'projects-tree-expand' );
        }
    },
    expandClass: function(){
    },
    newActivate: function(){
        g.run.back = FlowRouter.current().route.name;
        const tab = Session.get( 'projects.tab.name' );
        gtd.activateId( Template.projectsList.fn.newItem());
    },
    newClass: function(){
        return gtd.classesId( Template.projectsList.fn.newItem()).join( ' ' );
    },
    newItem: function(){
        const tab = Session.get( 'projects.tab.name' );
        return tab === 'gtd-review-projects-single' ? 'gtd-process-action-new' : 'gtd-process-project-new';
    },
    rebuildActivate: function( instance ){
        const tabsView = instance.ronin.tabsView;
        const tab = Session.get( 'projects.tab.name' );
        const $tree = Template.projects_tabs.fn.getTabTree( tabsView, tab );
        if( $tree ){
            $tree.trigger( 'projects-tree-rebuild' );
        }
    },
    rebuildClass: function(){
    }
};

Template.projectsList.onCreated( function(){
    //console.log( 'projectsList.onCreated' );
    this.ronin = {
        dict: new ReactiveDict(),
        spinner: null,
        tabsView: null,
        tabs: {}
    };
    this.ronin.dict.set( 'total_count', 0 );
    this.ronin.dict.set( 'window_ready', g.run.layout.get() === LYT_PAGE );
    this.ronin.dict.set( 'userId', Meteor.userId());
});

Template.projectsList.onRendered( function(){
    //console.log( 'projectsList.onRendered' );
    const self = this;
    const fn = Template.projectsList.fn;

    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            const context = Template.currentData();
            $( '.'+context.template ).IWindowed({
                template: context.template,
                simone: {
                    buttons: [
                        {
                            text: 'Close',
                            click: function(){
                                $().IWindowed.close( '.'+context.template );
                            }
                        },
                        {
                            //text: "Expand all",
                            title: 'Expand all',
                            icon: 'fas fa-expand-arrows-alt',
                            class: fn.expandClass(),
                            click: function(){
                                fn.expandActivate( self );
                            }
                        },
                        {
                            //text: "Rebuild",
                            title: 'Rebuild',
                            icon: 'fas fa-redo-alt',
                            class: fn.rebuildClass(),
                            click: function(){
                                fn.rebuildActivate( self );
                            }
                        },
                        {
                            //text: "Collapse all",
                            title: 'Collapse all',
                            icon: 'fas fa-compress-arrows-alt',
                            class: fn.collapseClass(),
                            click: function(){
                                fn.collapseActivate( self );
                            }
                        },
                        {
                            //text: "Dump",
                            title: 'Dump',
                            icon: 'fas fa-print',
                            class: fn.dumpClass(),
                            click: function(){
                                fn.dumpActivate( self );
                            }
                        },
                        {
                            text: 'New',
                            class: fn.newClass(),
                            click: function(){
                                fn.newActivate();
                            }
                        }
                    ],
                    group: context.group,
                    title: 'Review projects'
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

    // enable the actions depending of the logged-in user
    this.autorun(() => {
        const userId = Meteor.userId();
        if( userId !== self.ronin.dict.get( 'userId' )){
            if( g.run.layout.get() === LYT_WINDOW ){
                $( '.projectsList' ).IWindowed( 'buttonPaneResetClass', 1, fn.newClass());
            }
            self.ronin.dict.set( 'userId', userId );
        }
    });

    // each tree advertises itself when it has finished its build
    //  stop the spinner when the current is built
    $( '.projects-tabs' ).on( 'projects-tab-built', function( ev, o ){
        //console.log( ev );
        //console.log( o );
        self.ronin.tabsView = o.view;
        self.ronin.tabs[o.tab] = {
            projects_count: o.projects_count,
            actions_count: o.actions_count
        };
        if( o.tab === Session.get( 'projects.tab.name' ) && self.ronin.spinner ){
            self.ronin.spinner.stop();
        }
    });

    // handle the events of the buttons of the footer in layoutPage
    $( '.js-collapse' ).click(() => {
        Template.projectsList.fn.collapseActivate( self );
    });
    $( '.js-dump' ).click(() => {
        Template.projectsList.fn.dumpActivate( self );
    });
    $( '.js-expand' ).click(() => {
        Template.projectsList.fn.expandActivate( self );
    });
    $( '.js-rebuild' ).click(() => {
        Template.projectsList.fn.rebuildActivate( self );
    });
});

Template.projectsList.helpers({
    // display current counts
    actions_count(){
        const self = Template.instance();
        const total = 0;//self.ronin.dict.get( 'total_count' );
        const tabcount = 0;//self.ronin.dict.get( Session.get( 'projects.tab.name' )) || 0;
        return tabcount+'/'+total;
    },
    projects_count(){
        const self = Template.instance();
        const total = 0;//self.ronin.dict.get( 'total_count' );
        const tabcount = 0;//self.ronin.dict.get( Session.get( 'projects.tab.name' )) || 0;
        return tabcount+'/'+total;
    }
});
