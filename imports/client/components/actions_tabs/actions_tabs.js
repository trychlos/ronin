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
import '/imports/client/interfaces/itabbed/itabbed.js';
import './actions_tabs.html';

Template.actions_tabs.onCreated( function(){
    this.handle = this.subscribe( 'articles.actions.all' );
});

Template.actions_tabs.onRendered( function(){
    this.autorun(() => {
        if( this.handle.ready()){
            $('.actions-tabbed').ITabbed({
                tab: Session.get('actions.tab.name')
            });
        }
    });
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
    }
});
