/*
 * 'projects_tabs' component.
 *  Display projects and single actions as tabs.
 *
 *  Session variables:
 *  - projects.tab.name: the current tab.
 *
 *  Parameters:
 *  - label: the label to be displayed as the root node
 *  - tab: the identifier of the created instance (may not be the one currently shown).
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import { Counters } from '/imports/api/collections/counters/counters.js';
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/projects_tree/projects_tree.js';
import '/imports/client/interfaces/itabbed/itabbed.js';
import './projects_tabs.html';

Template.projects_tabs.onCreated( function(){
    //console.log( 'projects_tabs.onCreated' );
    this.ronin = {
        dict:  new ReactiveDict(),
        items: null
    };
    this.ronin.dict.set( 'count', 0 );
});

Template.projects_tabs.onRendered( function(){
    const self = this;

    this.autorun(() => {
        $( '.projects-tabs' ).ITabbed({
            tab: Session.get( 'projects.tab.name' )
        });
    });

    // when all the tabs have been rendered, advertise the window
    // use a jQuery message to get its attached data (here, the built tab)
    //  + the jQuery message is the only way to trigger the parent window in windowLayout :(
    $( '.projects-tabs' ).on( 'projects-tree-built', function( ev, o ){
        //console.log( ev );
        //console.log( o );
        let count = self.ronin.dict.get( 'count' );
        const items = self.ronin.items || [];
        count += 1;
        self.ronin.dict.set( 'count', count );
        if( count === items.length ){
            $( ev.target ).trigger( 'projects-tabs-built', { count:count });
        }
    });
});

Template.projects_tabs.helpers({
    gtdItems(){
        const self = Template.instance();
        if( !self.ronin.items ){
            self.ronin.items = gtd.items( 'projects' );
        }
        return self.ronin.items || [];
    },
    gtdLabel( item ){
        return gtd.labelItem( 'projects', item );
    },
    gtdRoute( item ){
        return gtd.routeItem( 'projects', item );
    }
});

Template.projects_tabs.onDestroyed( function(){
    //console.log( 'projects_tabs.onDestroyed' );
});
