/*
 * 'prefs_tabs' component.
 *  User preferences.
 *
 *  Session variables:
 *  - prefs.tab.name: the current tab.
 */
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/prefs_lists_panel/prefs_lists_panel.js';
import '/imports/client/interfaces/itabbed/itabbed.js';
import './prefs_tabs.html';

Template.prefs_tabs.onCreated( function(){
    if( !Session.get( 'prefs.tab.name' )){
        Session.set( 'prefs.tab.name', 'gtd-setup-prefs-window-list' );
    }
});

Template.prefs_tabs.onRendered( function(){
    this.autorun(() => {
        $( '.prefs-tabs' ).ITabbed({
            tab: Session.get( 'prefs.tab.name' )
        });
    });
});

Template.prefs_tabs.helpers({
    gtdItems(){
        return gtd.items( 'prefs' );
    },
    gtdLabel( it ){
        return gtd.labelItem( 'prefs', it );
    },
    gtdPanel( it ){
        return gtd.panelItem( 'prefs', it );
    },
    gtdRoute( it ){
        return gtd.routeItem( 'prefs', it );
    }
});
