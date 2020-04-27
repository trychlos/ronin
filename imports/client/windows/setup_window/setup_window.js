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
 *                      +-> setupWindow { gtdid, group, template }
 *                              +-> thoughts_list
 *                              +-> plus_button in page-based layout
 *                      |
 *                      +-> contextEdit { gtdid, group, template }
 *                      |
 *                      +-> energyValueEdit { gtdid, group, template }
 *                      |
 *                      +-> priorityValueEdit { gtdid, group, template }
 *
 *  Parameters:
 *  - 'data': the layout context built in appLayout, and passed in by group layer.
 *
 *  Session variables:
 *  - 'setup.tab.name': GTD identifier of the active tab.
 */
import { Spinner } from 'spin.js';
import { gtd } from '/imports/api/resources/gtd/gtd';
import '/imports/client/components/plus_button/plus_button.js';
import '/imports/client/components/setup_tabs/setup_tabs.js';
import '/imports/client/components/window_badge/window_badge.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './setup_window.html';

Template.setupWindow.fn = {
    newAction( instance, action ){
        // Template.instance() here is always the setup_tabs template instance
        //  maybe because the function is called from Template.setup_tabs.onRendered()
        //  so is useless here
        //const instance = Template.instance();
        //console.log( instance );
        //  Instead instance is passed by setup_tabs from its parentView which
        //  is expected to be this setupWindow
        instance.ronin.newAction.set( action );
    },
    spinnerStop( instance ){
        if( instance.ronin.spinner ){
            instance.ronin.spinner.stop();
            instance.ronin.spinner = null;
        }
    }
};

Template.setupWindow.onCreated( function(){
    this.ronin = {
        dict: new ReactiveDict(),
        $dom: null,
        newAction: new ReactiveVar( null ),
        spinner: null,
        timeout: null
    };
    this.ronin.dict.set( 'window_ready', Ronin.ui.runLayout() === R_LYT_PAGE );

    // initialize the mobile datas for this window
    Session.set( 'header.title', null );
    Session.set( 'header.badges', {} );
});

Template.setupWindow.onRendered( function(){
    const self = this;
    const fn = Template.setupWindow.fn;
    const context = Template.currentData();
    self.ronin.$dom = self.$( '.'+context.template );

    // open the window if the manager has been initialized
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
                            click: function(){
                                self.ronin.newAction.get().activate();
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
                Ronin.ui.runLayout() === R_LYT_PAGE ?
                    self.ronin.$dom :
                    self.ronin.$dom.window( 'widget' );
            //console.log( 'start the spinner' );
            self.ronin.spinner = new Spinner().spin( $parent[0] );
            self.ronin.timeout = Meteor.setTimeout(() => { fn.spinnerStop( self )}, 10000 );
        }
    });

    // on tab change, a new 'New' action should be considered and the buttons
    //  should be updated accordingly to reflect the new activable state
    //  > the plus_button is associated to the action via the action() helper
    //  > setup here windowLayout New button
    this.autorun(() => {
        if( Ronin.ui.runLayout() === R_LYT_WINDOW ){
            self.ronin.$dom.IWindowed( 'buttonActivate', 1, self.ronin.newAction.get().activable());
        }
    });

    // child messaging
    //  update the tab's count
    //  doesn't receive the first (zero) message sent by the child
    //  doesn't receive any more message if the collection is empty
    //console.log( 'attaching the event handler' );
    this.ronin.$dom.on( 'setup-tab-ready', function( ev, o ){
        //console.log( ev );
        //console.log( o );
        self.ronin.dict.set( o.id+'_count', o.count );
        //console.log( 'setupWindow '+Session.get( 'setup.tab.name' )+' '+o.id+' '+Boolean(self.ronin.spinner));
        if( o.id === Session.get( 'setup.tab.name' )){
            fn.spinnerStop( self );
        }
    });
});

Template.setupWindow.helpers({
    // plus_button helper
    //  returns the activable action, or null
    action(){
        return Template.instance().ronin.newAction.get();
    },
    // window_badge helper
    //  display current counts
    count(){
        const self = Template.instance();
        return self.ronin.dict.get( Session.get( 'setup.tab.name' )+'_count' ) || 0;
    }
});

Template.setupWindow.onDestroyed( function(){
    if( this.ronin.timeout ){
        Meteor.clearTimeout( this.ronin.timeout );
        this.ronin.timeout = null;
    }
});
