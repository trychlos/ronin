/*
 * 'setupWindow' window.
 *
 *  Embeds the tabbed 'setup_tabs' component.
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
import '/imports/client/components/setup_tabs/setup_tabs.js';
import '/imports/client/components/window_badge/window_badge.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './setup_window.html';

Template.setupWindow.fn = {
    newActivate: function(){
        g.run.back = FlowRouter.current().route.name;
        const gtdid = gtd.newId( Session.get( 'setup.tab.name' ));
        if( gtdid ){
            gtd.activateId( gtdid );
        }
    },
    newClasses: function(){
        return '';// gtd.classesId( 'gtd-process-action-new' ).join( ' ' );
    }
};

Template.setupWindow.onCreated( function(){
    this.ronin = {
        dict: new ReactiveDict(),
        spinner: null
    };
    this.ronin.dict.set( 'window_ready', g.run.layout.get() === LYT_PAGE );
});

Template.setupWindow.onRendered( function(){
    const self = this;
    const fn = Template.setupWindow.fn;

    // open the window if the manager has been initialized
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
                            class: fn.newClasses(),
                            click: function(){
                                fn.newActivate();
                            }
                        }
                    ],
                    group: context.group,
                    title: 'Setup'
                }
            });
            self.ronin.dict.set( 'window_ready', true );
        }
    });

    // create the spinner as soon as the window is ready
    this.autorun(() => {
        if( self.ronin.dict.get( 'window_ready' )){
            const $parent =
                g.run.layout.get() === LYT_PAGE ?
                    $( '.setupWindow' ) :
                    $( '.setupWindow' ).window( 'widget' );
            self.ronin.spinner = new Spinner().spin( $parent[0] );
        }
    });

    // child messaging
    //  update the tab's count
    //  stop the spinner when currently displayed tab has sent its message
    $( '.setupWindow' ).on( 'setup-tab-ready', function( ev, o ){
    //document.addEventListener( 'setup-tab-ready', function( ev, o ){
        //console.log( ev );
        console.log( o );
        console.log( 'setup.tab.name='+Session.get( 'setup.tab.name' ));
        self.ronin.dict.set( o.id+'_count', o.count );
        // maybe stop the spinner
        if( o.id === Session.get( 'setup.tab.name' ) && self.ronin.spinner ){
            self.ronin.spinner.stop();
        }
    });
});

Template.setupWindow.helpers({
    // display current counts
    count(){
        const self = Template.instance();
        return self.ronin.dict.get( Session.get( 'setup.tab.name' )+'_count' ) || 0;
    }
});
