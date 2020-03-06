/*
 * 'thoughtsList' window.
 *
 *  Display (at least) the list of thoughts.
 *  Each thought has buttons:
 *  - to create/update/delete the thought
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
    actionNew: function(){
        g.run.back = FlowRouter.current().route.name;
        FlowRouter.go( 'rt.thoughts.new' );
    }
};

Template.thoughtsList.onCreated( function(){
    //console.log( 'thoughtsList.onCreated' );
    this.ronin = {
        dict: new ReactiveDict(),
        handles: [
            this.subscribe( 'articles.thoughts.all' ),
            this.subscribe( 'topics.all' )
        ],
        spinner: null
    };
    this.ronin.dict.set( 'window_ready', g.run.layout.get() === LYT_PAGE );
    this.ronin.dict.set( 'subscriptions_ready', false );
});

Template.thoughtsList.onRendered( function(){
    //console.log( 'thoughtsList.onRendered' );
    const self = this;

    // create the window
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
                                $.pubsub.publish( 'ronin.ui.thoughts.list.card.collapse-all' );
                                $().IWindowed.close( '.'+context.template );
                            }
                        },
                        {
                            text: "New",
                            click: function(){
                                Template.thoughtsList.fn.actionNew();
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
            if( g.run.layout.get() === LYT_PAGE ){
                $parent = $( '.thoughtsList' );
            } else {
                $parent = $( '.thoughtsList' ).window( 'widget' );
            }
            if( $parent ){
                self.ronin.spinner = new Spinner().spin( $parent[0] );
            }
        }
    });

    // wait for subscriptions are ready
    this.autorun(() => {
        let ready = true;
        self.ronin.handles.forEach( h => {
            ready = ready && h.ready();
        });
        self.ronin.dict.set( 'subscriptions_ready', ready );
    });

    // stop the spinner when subscriptions are ready
    this.autorun(() => {
        if( self.ronin.dict.get( 'subscriptions_ready' ) && self.ronin.spinner ){
            self.ronin.spinner.stop();
        }
    });
});

Template.thoughtsList.helpers({
    count(){
        return Articles.find({ type:'T' }, { sort:{ createdAt: -1 }}).count();
    },
    thoughts(){
        return Articles.find({ type:'T' }, { sort:{ createdAt: -1 }});
    }
});

Template.thoughtsList.events({
    // page layout
    'click .js-new'( ev, instance ){
        Template.thoughtsList.fn.actionNew();
        return false;
    }
});
