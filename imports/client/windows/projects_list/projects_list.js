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
    dumpActivate: function( instance ){
        const tabsView = instance.ronin.tabsView;
        const tab = Session.get( 'projects.tab.name' );
        const $tree = Template.projects_tabs.fn.getTabTree( tabsView, tab );
        if( $tree ){
            $tree.trigger( 'projects-tree-dump' );
        }
    },
    expandActivate: function( instance ){
        const tabsView = instance.ronin.tabsView;
        const tab = Session.get( 'projects.tab.name' );
        const $tree = Template.projects_tabs.fn.getTabTree( tabsView, tab );
        if( $tree ){
            $tree.trigger( 'projects-tree-expand' );
        }
    },
    newAction( instance, action ){
        instance.ronin.newAction.set( action );
    },
    newActivate: function( msg, o ){
        //console.log( msg );
        //console.log( o );
        const gtdid = o.userdata.data;
        if( gtdid ){
            gtd.activateId( gtdid );
        } else {
            console.log( 'Unable to find which gtdId to be run for New activation. '+
                            'Please make sure a "newId" key is defined in gtd.js' );
        }
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
        newAction: new ReactiveVar( null ),
        spinner: null,
        tabsView: null,
        timeout: null
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
                            click: function(){
                                fn.expandActivate( self );
                            }
                        },
                        {
                            //text: "Rebuild",
                            title: 'Rebuild',
                            icon: 'fas fa-redo-alt',
                            click: function(){
                                fn.rebuildActivate( self );
                            }
                        },
                        {
                            //text: "Collapse all",
                            title: 'Collapse all',
                            icon: 'fas fa-compress-arrows-alt',
                            click: function(){
                                fn.collapseActivate( self );
                            }
                        },
                        {
                            //text: "Dump",
                            title: 'Dump',
                            icon: 'fas fa-print',
                            click: function(){
                                fn.dumpActivate( self );
                            }
                        },
                        {
                            text: 'New',
                            click: function(){
                                self.ronin.newAction.get().activate();
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

    // on tab change, a new 'New' action should be considered and the buttons
    //  should be updated accordingly to reflect the new activable state
    //  > the plus_button is associated to the action via the action() helper
    //  > setup here windowLayout New button
    this.autorun(() => {
        if( Ronin.ui.runLayout() === R_LYT_WINDOW ){
            self.ronin.$dom.IWindowed( 'actionSet', 5, self.ronin.newAction.get());
        }
    });

    // each tree advertises itself when it has finished its build
    $( '.projects-tabs' ).on( 'projects-tab-ready', function( ev, o ){
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
        fn.collapseActivate( self );
    });
    $( '.js-dump' ).click(() => {
        fn.dumpActivate( self );
    });
    $( '.js-expand' ).click(() => {
        fn.expandActivate( self );
    });
    $( '.js-rebuild' ).click(() => {
        fn.rebuildActivate( self );
    });

    // deal with the 'new' action
    //  setup_tabs has taken care of recording the 'new' template as action user data
    $.pubsub.subscribe( 'action.activate', fn.newActivate );
});

Template.projectsList.helpers({
    // display actions count
    actionsCount(){
        const self = Template.instance();
        const tabs = self.ronin.dict.get( 'tabs' );
        const o = tabs[Session.get( 'projects.tab.name' )];
        const total = self.ronin.dict.get( 'actions_count' ) || 0;
        const tabcount = o ? o.actions_count : 0;
        return 'A: '+tabcount+'/'+total;
    },
    // associate the 'New' action with the 'New' button
    newAction(){
        return Template.instance().ronin.newAction.get();
    },
    // display projects count
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
