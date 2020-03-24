/*
 * 'setup_tabs' component.
 *
 *  Display a tab per reference table.
 *
 *  NB: each reference table (aka grid) has to be enumerated here so that the
 *  templating system is able to use it.
 *  As there is already an enumeration in this file, we subscribe here to each
 *  and every collection.
 *
 *  Parameters:
 *  - 'data': the layout context built in appLayout, and passed in by group layer.
 *
 *  Session variables:
 *  - setup.tab.name: the identifier of the active tab
 *      aka the identifier of the corresponding option in 'gtd' features.
 */
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/prefs_lists_panel/prefs_lists_panel.js';
import '/imports/client/components/contexts_grid/contexts_grid.js';
import '/imports/client/components/time_values_grid/time_values_grid.js';
import '/imports/client/components/topics_grid/topics_grid.js';
import '/imports/client/interfaces/itabbed/itabbed.js';
import './setup_tabs.html';

Template.setup_tabs.fn = {
    _prefTabular: null,
    // use the user+device preferences to choose between cards and grid
    //  default is layout dependant
    tabularIsPreferred(){
        const fn = Template.setup_tabs.fn;
        if( !fn._prefTabular ){
            const prefs = Template.prefs_lists_panel.fn.readDevicePrefs();
            fn._prefTabular = prefs.lists.setup || 'def';
            if( fn._prefTabular === 'def' ){
                fn._prefTabular = ( g.run.layout.get() === LYT_PAGE ? 'cards' : 'grid' );
            }
        }
        return( fn._prefTabular === 'grid' );
    }
};

Template.setup_tabs.onCreated( function(){
    this.ronin = {
        dict: new ReactiveDict(),
        items: gtd.items( 'setup' ),
        tabs: [
            {
                gtd: 'gtd-setup-contexts',
                component: 'contexts_grid',
                handle: this.subscribe( 'contexts.all' )
            },
            {
                gtd: 'gtd-setup-time',
                component: 'time_values_grid',
                handle: this.subscribe( 'time_values.all' )
            },
            {
                gtd: 'gtd-setup-topics',
                component: 'topics_grid',
                handle: this.subscribe( 'topics.all' )
            }
        ]
    };
});

Template.setup_tabs.onRendered( function(){
    this.autorun(() => {
        $( '.setup-tabs' ).ITabbed({
            tab: Session.get( 'setup.tab.name' )
        });
    })
});

Template.setup_tabs.helpers({
    gtdComponent( it ){
        const self = Template.instance();
        for( let i=0 ; i<self.ronin.tabs.length ; ++i ){
            if( self.ronin.tabs[i].gtd === it.id ){
                return self.ronin.tabs[i].component;
            }
        }
        return null;
    },
    gtdItems(){
        const self = Template.instance();
        return self.ronin.items;
    },
    gtdLabel( it ){
        return gtd.labelItem( 'setup', it );
    },
    gtdRoute( it ){
        return gtd.routeItem( 'setup', it );
    },
    tabularIsPreferred(){
        return Template.setup_tabs.fn.tabularIsPreferred();
    }
});
