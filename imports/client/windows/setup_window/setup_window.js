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
import '/imports/client/components/setup_tabs/setup_tabs.js';
import '/imports/client/components/window_badge/window_badge.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './setup_window.html';

Template.setupWindow.onCreated( function(){
    this.ronin = {
        dict: new ReactiveDict(),
        spinner: null,
        tabs: {}
    };
    this.ronin.dict.set( 'window_ready', g.run.layout.get() === LYT_PAGE );
    this.ronin.dict.set( 'total_count', 0 );
});

Template.setupWindow.onRendered( function(){
    const self = this;

    // open the window if the manager has been initialized
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            const context = Template.currentData();
            $( '.'+context.template ).IWindowed({
                template: context.template,
                simone: {
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
});

Template.setupWindow.helpers({
    // display current counts
    count(){
        const self = Template.instance();
        const total = self.ronin.dict.get( 'total_count' );
        const count = self.ronin.dict.get( Session.get( 'actions.tab.name' )+'_count' ) || 0;
        return count+'/'+total;
    }
});
