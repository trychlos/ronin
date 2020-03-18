/*
 * 'actions_tabs' component.
 *  Display actions and single actions as tabs.
 *
 ***  Parameters:
 ***  - actions: the cursor to the actions to be displayed.
 *
 *  Session variables:
 *  - actions.tab.name: the current tab.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/actions_grid/actions_grid.js';
import '/imports/client/components/action_card/action_card.js';
import '/imports/client/components/prefs_lists_panel/prefs_lists_panel.js';
import '/imports/client/interfaces/itabbed/itabbed.js';
import './actions_tabs.html';

Template.actions_tabs.fn = {
    _prefTabular: null,
    // use the user+device preferences to choose between cards and grid
    //  default is layout dependant
    tabularIsPreferred(){
        const fn = Template.actions_tabs.fn;
        if( !fn._prefTabular ){
            const prefs = Template.prefs_lists_panel.fn.readDevicePrefs();
            fn._prefTabular = prefs.lists.actions;
            if( fn._prefTabular === 'def' ){
                fn._prefTabular = ( g.run.layout.get() === LYT_PAGE ? 'cards' : 'grid' );
            }
        }
        return( fn._prefTabular === 'grid' );
    }
};

Template.actions_tabs.onCreated( function(){
    const self = this;
    this.ronin = {
        dict: new ReactiveDict(),
        items: gtd.items( 'actions' ),
        handles: {}
    };
    this.ronin.items.forEach( it => {
        const status = gtd.statusItem( it );
        self.ronin.handles[it.id] = {
            status: status,
            h: self.subscribe( 'articles.actions.status', status )
        };
        self.ronin.dict.set( 'item_'+it.id, false );
        self.ronin.dict.set( 'count_'+it.id, 0 );
    });
});

Template.actions_tabs.onRendered( function(){
    const self = this;
    //console.log( 'actions_tabs.onRendered' );
    this.autorun(() => {
        $( '.actions-tabs' ).ITabbed({
            tab: Session.get( 'actions.tab.name' )
        });
    });
    // send the count when each tab subscription is ready
    this.autorun(() => {
        self.ronin.items.forEach( it => {
            if( self.ronin.handles[it.id].h.ready() && !self.ronin.dict.get( 'item_'+it.id )){
                const status = self.ronin.handles[it.id].status;
                const count = Articles.find({ type:'A', status:status }).count();
                $( '.actions-tabs' ).trigger( 'actions-tabs-ready', {
                    id: it.id,
                    status: status,
                    count: count
                });
                self.ronin.dict.set( 'item_'+it.id, true );
                self.ronin.dict.set( 'count_'+it.id, count );
            }
        });
    });
});

Template.actions_tabs.helpers({
    actions( it ){
        const self = Template.instance();
        return Articles.find({ type:'A', status:self.ronin.handles[it.id].status });
    },
    gtdItems(){
        const self = Template.instance();
        return self.ronin.items;
    },
    gtdLabel( it ){
        return gtd.labelItem( 'actions', it );
    },
    gtdRoute( it ){
        return gtd.routeItem( 'actions', it );
    },
    tabularIsPreferred(){
        return Template.actions_tabs.fn.tabularIsPreferred();
    }
});

Template.actions_tabs.events({
    // when cards are shown instead of grid (pageLayout default)
    'ronin-collapse-all'( ev, instance ){
        $( '.actions-list-item' ).removeClass( 'x-opened' );
    }
});
