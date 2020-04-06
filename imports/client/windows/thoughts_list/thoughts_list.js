/*
 * 'thoughtsList' window.
 *
 *  Display (at least) the list of thoughts.
 *  Each thought has buttons:
 *  - to update/delete the thought
 *  - or to transform it to action, project or maybe.
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
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/plus_button/plus_button.js';
import '/imports/client/components/thoughts_list/thoughts_list.js';
import '/imports/client/components/window_badge/window_badge.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './thoughts_list.html';

Template.thoughtsList.fn = {
    newActivate: function(){
        gtd.activateId( 'gtd-collect-thought-new' );
    },
    newClasses: function(){
        return gtd.classesId( 'gtd-collect-thought-new' ).join( ' ' );
    }
};

Template.thoughtsList.onCreated( function(){
    //console.log( 'thoughtsList.onCreated' );
    this.ronin = {
        dict: new ReactiveDict(),
        $dom: null,
        handles: {
            thoughts: this.subscribe( 'articles.thoughts.all' ),
            topics: this.subscribe( 'topics.all' )
        },
        spinner: null,
        timeout: null
    };
    this.ronin.dict.set( 'count', 0 );
    this.ronin.dict.set( 'window_ready', Ronin.ui.runLayout() === LYT_PAGE );
    this.ronin.dict.set( 'subscriptions_ready', false );
    this.ronin.dict.set( 'userId', Meteor.userId());
});

Template.thoughtsList.onRendered( function(){
    //console.log( 'thoughtsList.onRendered' );
    const self = this;
    const fn = Template.thoughtsList.fn;
    const context = Template.currentData();
    self.ronin.$dom = self.$( '.'+context.template );

    // create the window
    this.autorun(() => {
        if( Ronin.ui.layouts[LYT_WINDOW].taskbar.get()){
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
                    group:  context.group,
                    title:  gtd.labelId( null, context.gtdid )
                }
            });
            self.ronin.dict.set( 'window_ready', true );
        }
    });

    // create a new spinner as soon as the window is ready
    this.autorun(() => {
        if( self.ronin.dict.get( 'window_ready' )){
            let $parent = null;
            if( Ronin.ui.runLayout() === LYT_PAGE ){
                $parent = self.ronin.$dom;
            } else {
                $parent = self.ronin.$dom.window( 'widget' );
            }
            if( $parent ){
                self.ronin.spinner = new Spinner().spin( $parent[0] );
                Meteor.setTimeout(() => {
                    if( self.ronin.spinner ){
                        self.ronin.spinner.stop();
                        self.ronin.spinner = null;
                    }
                }, 15000 );
            }
        }
    });

    // count the thoughts
    this.autorun(() => {
        if( self.ronin.handles.thoughts.ready()){
            self.ronin.dict.set( 'count', Articles.find({ type:'T' }).count());
        }
    });

    // wait for all subscriptions are ready
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
        if( self.ronin.dict.get( 'subscriptions_ready' ) && self.ronin.spinner ){
            self.ronin.spinner.stop();
            self.ronin.spinner = null;
        }
    });

    // activate the actions depending of the logged-in user
    this.autorun(() => {
        const userId = Meteor.userId();
        if( userId !== self.ronin.dict.get( 'userId' )){
            if( Ronin.ui.runLayout() === LYT_WINDOW ){
                $( '.thoughtsList' ).IWindowed( 'buttonPaneResetClass', 1, fn.newClasses());
            }
            self.ronin.dict.set( 'userId', userId );
        }
    });
});

Template.thoughtsList.helpers({
    count(){
        return Template.instance().ronin.dict.get( 'count' );
    },
    thoughts(){
        return Articles.find({ type:'T' }, { sort:{ createdAt: -1 }});
    }
});

Template.thoughtsList.events({
    // page layout
    'click .js-new'( ev, instance ){
        Template.thoughtsList.fn.newActivate();
        return false;
    }
});

Template.thoughtsList.onDestroyed( function(){
    if( this.ronin.timeout ){
        Meteor.clearTimeout( this.ronin.timeout );
        this.ronin.timeout = null;
    }
});
