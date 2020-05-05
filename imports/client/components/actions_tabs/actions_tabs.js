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
    tabular( instance ){
        instance.ronin.dict.set( 'tabular', Ronin.prefs.listsPref( 'actions' ) === R_LIST_GRID );
    }
};

Template.actions_tabs.onCreated( function(){
    const self = this;
    const fn = Template.actions_tabs.fn;

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
        self.ronin.dict.set( 'count_'+it.id, 0 );
    });
    fn.tabular( self );

    $.pubsub.subscribe( 'ronin.ui.prefs.updated', ( msg ) => {
        fn.tabular( self );
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
            if( self.ronin.handles[it.id].h.ready()){
                const status = self.ronin.handles[it.id].status;
                const count = Articles.find({ type:R_OBJ_ACTION, status:status }).count();
                const prev = self.ronin.dict.get( 'count_'+it.id );
                if( count !== prev ){
                    $( '.actions-tabs' ).trigger( 'actions-tabs-ready', {
                        id: it.id,
                        status: status,
                        count: count
                    });
                    self.ronin.dict.set( 'count_'+it.id, count );
                }
            }
        });
    });
});

Template.actions_tabs.helpers({
    actions( it ){
        const self = Template.instance();
        return Articles.find({ type:R_OBJ_ACTION, status:self.ronin.handles[it.id].status });
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
        return Template.instance().ronin.dict.get( 'tabular' );
    }
});

Template.actions_tabs.events({
    // when cards are shown instead of grid (pageLayout default)
    'ronin-collapse-all'( ev, instance ){
        $( '.actions-list-item' ).removeClass( 'x-opened' );
    }
});
