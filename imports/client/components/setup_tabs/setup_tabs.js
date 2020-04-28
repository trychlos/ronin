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
 *      aka the identifier of the corresponding option in 'gtd' features
 *  - 'setup.tab.action.new': the 'New' Activable() action for the current tab.
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
    tabular( instance ){
        instance.ronin.dict.set( 'tabular', Ronin.prefs.listsPref( 'setup' ) === R_LIST_GRID );
    }
};

Template.setup_tabs.onCreated( function(){
    const self = this;
    const fn = Template.setup_tabs.fn;

    this.ronin = {
        dict: new ReactiveDict(),
        $dom: null,
        items: gtd.items( 'setup' ),
        tabs: {
            'gtd-setup-contexts': {
                handle: this.subscribe( 'contexts.all' ),
                cursorFn: function(){ return Contexts.find(); },
                action: new Ronin.ActionEx({
                    type: R_OBJ_CONTEXT,
                    action: R_ACT_NEW,
                    gtd: gtd.newId( 'gtd-setup-contexts' )
                })
            },
            'gtd-setup-delegates': {
                handle: this.subscribe( 'delegates.all' ),
                cursorFn: function(){ return Delegates.find(); },
                action: new Ronin.ActionEx({
                    type: R_OBJ_DELEGATE,
                    action: R_ACT_NEW,
                    gtd: gtd.newId( 'gtd-setup-delegates' )
                })
            },
            'gtd-setup-energy': {
                handle: this.subscribe( 'energy_values.all' ),
                cursorFn: function(){ return EnergyValues.find(); },
                action: new Ronin.ActionEx({
                    type: R_OBJ_ENERGY,
                    action: R_ACT_NEW,
                    gtd: gtd.newId( 'gtd-setup-energy' )
                })
            },
            'gtd-setup-priority': {
                handle: this.subscribe( 'priority_values.all' ),
                cursorFn: function(){ return PriorityValues.find(); },
                action: new Ronin.ActionEx({
                    type: R_OBJ_PRIORITY,
                    action: R_ACT_NEW,
                    gtd: gtd.newId( 'gtd-setup-priority' )
                })
            },
            'gtd-setup-refs': {
                handle: this.subscribe( 'references.all' ),
                cursorFn: function(){ return References.find(); },
                action: new Ronin.ActionEx({
                    type: R_OBJ_REFERENCE,
                    action: R_ACT_NEW,
                    gtd: gtd.newId( 'gtd-setup-refs' )
                })
            },
            'gtd-setup-time': {
                handle: this.subscribe( 'time_values.all' ),
                cursorFn: function(){ return TimeValues.find(); },
                action: new Ronin.ActionEx({
                    type: R_OBJ_TIME,
                    action: R_ACT_NEW,
                    gtd: gtd.newId( 'gtd-setup-time' )
                })
            },
            'gtd-setup-topics': {
                handle: this.subscribe( 'topics.all' ),
                cursorFn: function(){ return Topics.find(); },
                action: new Ronin.ActionEx({
                    type: R_OBJ_TOPIC,
                    action: R_ACT_NEW,
                    gtd: gtd.newId( 'gtd-setup-topics' )
                })
            }
        }
    };
    fn.tabular( self );

    // new actions default to be activable
    Object.keys( this.ronin.tabs ).forEach( gtdid => {
        self.ronin.tabs[gtdid].action.activable( true );
    });

    // make the preference reactive
    $.pubsub.subscribe( 'ronin.ui.prefs.updated', ( msg ) => {
        fn.tabular( self );
    });
});

Template.setup_tabs.onRendered( function(){
    const self = this;
    const fn = Template.setup_tabs.fn;
    this.ronin.$dom = this.$( '.setup-tabs' );

    this.autorun(() => {
        const tab = Session.get( 'setup.tab.name' );
        self.ronin.$dom.ITabbed({ tab:tab });

        // this is ok and works fine locally
        //  but does not survive the Session get/set which returns only a plain object
        //  not the instance with its prototype (because not EJSON-able)
        //Session.set( 'setup.tab.action.new', self.ronin.tabs[tab].action );

        // the message cannot be handled at initialization time because the handler
        //  is declared in the parent onRendered() (needs the DOM be available) which
        //  happens after this one
        //self.ronin.$dom.trigger( 'setup-tab-action', { action: self.ronin.tabs[tab].action });

        //console.log( self );
        //Template.setupWindow.fn.newAction( self.data.parent, self.ronin.tabs[tab].action );
        const pv = self.view.parentView;    // aka Template.setupWindow
        pv.template.fn.newAction( pv._templateInstance, self.ronin.tabs[tab].action );
    });
});

Template.setup_tabs.helpers({
    dataTab( it ){
        const instance = Template.instance();
        return {
            gtd: it,
            items: instance.ronin.tabs[it.id].cursorFn()
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
    // the message is first sent with a zero count at creation time
    //  but it is too soon for the parent having already subscribed to it
    // then resent when the subscription is ready and the count changes
    // unfortunately, the message is not resent if the collection is empty
    msgWindow( it ){
        const count = Template.instance().ronin.tabs[it.id].cursorFn().count()
        //console.log( 'setup_tabs '+it.id+' count='+count );
        $( '.setup-tabs' ).trigger( 'setup-tab-ready', {
            id: it.id,
            count: count
        });
    },
    tabItems( it ){
        const instance = Template.instance();
        return instance.ronin.tabs[it.id].cursorFn();
    },
    tabularIsPreferred(){
        return Template.instance().ronin.dict.get( 'tabular' );
    }
});

Template.setup_tabs.events({
    // when cards are shown instead of grid (pageLayout default)
    'ronin-collapse-all'( ev, instance ){
        $( '.setup-card' ).removeClass( 'x-opened' );
    }
});
