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
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import { Delegates } from '/imports/api/collections/delegates/delegates.js';
import { EnergyValues } from '/imports/api/collections/energy_values/energy_values.js';
import { PriorityValues } from '/imports/api/collections/priority_values/priority_values.js';
import { References } from '/imports/api/collections/references/references.js';
import { TimeValues } from '/imports/api/collections/time_values/time_values.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/prefs_lists_panel/prefs_lists_panel.js';
import '/imports/client/components/contexts_grid/contexts_grid.js';
import '/imports/client/components/delegates_grid/delegates_grid.js';
import '/imports/client/components/energy_values_grid/energy_values_grid.js';
import '/imports/client/components/priority_values_grid/priority_values_grid.js';
import '/imports/client/components/references_grid/references_grid.js';
import '/imports/client/components/setup_card/setup_card.js';
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
    },
    // return the element of the 'ronin.tabs' array which corresponds to the specified id
    tab( instance, name ){
        for( let i=0 ; i<instance.ronin.tabs.length ; ++i ){
            if( instance.ronin.tabs[i].gtd === name ){
                return instance.ronin.tabs[i];
            }
        }
        return null;
    }
};

Template.setup_tabs.onCreated( function(){
    this.ronin = {
        dict: new ReactiveDict(),
        items: gtd.items( 'setup' ),
        tabs: [
            {
                gtd: 'gtd-setup-contexts',
                handle: this.subscribe( 'contexts.all' ),
                cursorFn: function(){ return Contexts.find(); }
            },
            {
                gtd: 'gtd-setup-delegates',
                handle: this.subscribe( 'delegates.all' ),
                cursorFn: function(){ return Delegates.find(); }
            },
            {
                gtd: 'gtd-setup-energy',
                handle: this.subscribe( 'energy_values.all' ),
                cursorFn: function(){ return EnergyValues.find(); }
            },
            {
                gtd: 'gtd-setup-priority',
                handle: this.subscribe( 'priority_values.all' ),
                cursorFn: function(){ return PriorityValues.find(); }
            },
            {
                gtd: 'gtd-setup-refs',
                handle: this.subscribe( 'references.all' ),
                cursorFn: function(){ return References.find(); }
            },
            {
                gtd: 'gtd-setup-time',
                handle: this.subscribe( 'time_values.all' ),
                cursorFn: function(){ return TimeValues.find(); }
            },
            {
                gtd: 'gtd-setup-topics',
                handle: this.subscribe( 'topics.all' ),
                cursorFn: function(){ return Topics.find(); }
            }
        ]
    };
});

Template.setup_tabs.onRendered( function(){
    this.autorun(() => {
        $( '.setup-tabs' ).ITabbed({
            tab: Session.get( 'setup.tab.name' )
        });
    });
});

Template.setup_tabs.helpers({
    dataTab( it ){
        const tab = Template.setup_tabs.fn.tab( Template.instance(), it.id );
        return {
            gtd: it,
            items: tab ? tab.cursorFn() : null
        };
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
    msgWindow( it ){
        const tab = Template.setup_tabs.fn.tab( Template.instance(), it.id );
        $( '.setup-tabs' ).trigger( 'setup-tab-ready', {
            id: it.id,
            count: tab ? tab.cursorFn().count() : null
        });
    },
    tabItems( it ){
        const tab = Template.setup_tabs.fn.tab( Template.instance(), it.id );
        return tab ? tab.cursorFn() : null;
    },
    tabularIsPreferred(){
        return Template.setup_tabs.fn.tabularIsPreferred();
    }
});

Template.setup_tabs.events({
    // when cards are shown instead of grid (pageLayout default)
    'ronin-collapse-all'( ev, instance ){
        $( '.setup-card' ).removeClass( 'x-opened' );
    }
});
