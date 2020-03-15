/*
 * 'actions_tabs' component.
 *  Display actions and single actions as tabs.
 *
 *  Parameters:
 *  - actions: the cursor to the actions to be displayed.
 *
 *  Session variables:
 *  - actions.tab.name: the current tab.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/actions_grid/actions_grid.js';
import '/imports/client/components/actions_list_item/actions_list_item.js';
import '/imports/client/components/prefs_lists_panel/prefs_lists_panel.js';
import '/imports/client/interfaces/itabbed/itabbed.js';
import './actions_tabs.html';

Template.actions_tabs.onRendered( function(){
    this.autorun(() => {
        $( '.actions-tabs' ).ITabbed({
            tab: Session.get( 'actions.tab.name' )
        });
    })
});

Template.actions_tabs.helpers({
    actions( it ){
        return Articles.find({ type:'A', status:gtd.statusItem( it )});
    },
    gtdItems(){
        return gtd.items( 'actions' );
    },
    gtdLabel( it ){
        return gtd.labelItem( 'actions', it );
    },
    gtdRoute( it ){
        return gtd.routeItem( 'actions', it );
    },
    // use the user+device preferences to choose between cards and grid
    //  default is layout dependant
    tabularIsPreferred(){
        const prefs = Template.prefs_lists_panel.fn.readDevicePrefs();
        const display = prefs.lists.actions;
        if( display === 'def' ){
            display = g.run.layout.get() === LYT_PAGE ? 'cards' : 'grid';
        }
        return display === 'grid';
    }
});

Template.actions_tabs.events({
    // when cards are shown instead of grid (pageLayout default)
    'ronin-collapse-all'( ev, instance ){
        $( '.actions-list-item' ).removeClass( 'x-opened' );
    }
});
