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
    },
    spinnerStart: function( instance ){
        let $parent = null;
        if( Ronin.ui.runLayout() === R_LYT_PAGE ){
            $parent = instance.ronin.$dom;
        } else {
            $parent = instance.ronin.$dom.window( 'widget' );
        }
        if( $parent ){
            instance.ronin.spinner = new Spinner().spin( $parent[0] );
            Meteor.setTimeout(() => {
                if( instance.ronin.spinner ){
                    instance.ronin.spinner.stop();
                    instance.ronin.spinner = null;
                }
            }, 15000 );
        }
    },
    spinnerStop: function( instance ){
        if( instance.ronin.spinner ){
            instance.ronin.spinner.stop();
            instance.ronin.spinner = null;
        }
    }
};

Template.projectsList.onCreated( function(){
    //console.log( 'projectsList.onCreated' );
    this.ronin = {
        dict: new ReactiveDict(),
        $dom: null,
        spinner: null,
        timeout: null,
        tabsView: null
    };
    this.ronin.dict.set( 'projects_count', 0 );
    this.ronin.dict.set( 'actions_count', 0 );
    this.ronin.dict.set( 'window_ready', Ronin.ui.runLayout() === R_LYT_PAGE );
    this.ronin.dict.set( 'userId', Meteor.userId());
    this.ronin.dict.set( 'tabs', {} );

    // initialize the mobile datas for this window
    Session.set( 'header.title', null );
    Session.set( 'header.badges', {} );
});

Template.projectsList.onRendered( function(){
    const self = this;
    const fn = Template.projectsList.fn;
    const context = Template.currentData();
    self.ronin.$dom = self.$( '.'+context.template );

    this.autorun(() => {
        //console.log( 'projectsList.onRendered autorun()' );
        if( Ronin.ui.layouts[R_LYT_WINDOW].taskbar.get() && !self.ronin.dict.get( 'window_ready' )){
            self.ronin.$dom.IWindowed({
                template: context.template,
                simone: {
                    buttons: [
                        {
                            text: 'Close',
                            click: function(){
                                self.ronin.$dom.IWindowed( 'close' );
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
            fn.spinnerStart( self );
        }
    });

    // enable the actions depending of the logged-in user
    this.autorun(() => {
        if( Ronin.ui.runLayout() === R_LYT_WINDOW ){
            const userId = Meteor.userId();
            if( userId !== self.ronin.dict.get( 'userId' )){
                self.ronin.$dom.IWindowed( 'paneSetClass', 5, fn.newClass());
                self.ronin.dict.set( 'userId', userId );
            }
        }
    });

    // each tree advertises itself when it has finished its build
    $( '.projects-tabs' ).on( 'projects-tab-built', function( ev, o ){
        //console.log( ev );
        //console.log( o );
        self.ronin.tabsView = o.view;
        let tabs = self.ronin.dict.get( 'tabs' );
        tabs[o.tab] = {
            projects_count: o.projects_count,
            actions_count: o.actions_count
        };
        // update the totals
        projects_count = 0;
        actions_count = 0
        Object.keys( tabs ).forEach( tab => {
            projects_count += tabs[tab].projects_count;
            actions_count += tabs[tab].actions_count;
        });
        self.ronin.dict.set( 'tabs', tabs );
        self.ronin.dict.set( 'projects_count', projects_count );
        self.ronin.dict.set( 'actions_count', actions_count );
        // stop the spinner when the current tree is built
        if( o.tab === Session.get( 'projects.tab.name' )){
            fn.spinnerStop( self );
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
    actionsCount(){
        const self = Template.instance();
        const tabs = self.ronin.dict.get( 'tabs' );
        const o = tabs[Session.get( 'projects.tab.name' )];
        const total = self.ronin.dict.get( 'actions_count' ) || 0;
        const tabcount = o ? o.actions_count : 0;
        return 'A: '+tabcount+'/'+total;
    },
    projectsCount(){
        const self = Template.instance();
        const tabs = self.ronin.dict.get( 'tabs' );
        const o = tabs[Session.get( 'projects.tab.name' )];
        const total = self.ronin.dict.get( 'projects_count' ) || 0;
        const tabcount = o ? o.projects_count : 0;
        return 'P: '+tabcount+'/'+total;
    }
});

Template.projectsList.onDestroyed( function(){
    //console.log( 'projectsList.onDestroyed' );
    if( this.ronin.timeout ){
        Meteor.clearTimeout( this.ronin.timeout );
        this.ronin.timeout = null;
    }
});
