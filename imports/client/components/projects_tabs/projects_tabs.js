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
        gtdItems: null,
        $trees: {}
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
        count += 1;
        self.ronin.dict.set( 'count', count );
        const items = self.ronin.gtdItems || [];
        if( count === items.length ){
            $( ev.target ).trigger( 'projects-tabs-built', { count:count });
        }
        if( !self.ronin.$trees[o.tab] ){
            self.ronin.$trees[o.tab] = o.$tree;
        }
    });
});

Template.projects_tabs.helpers({
    gtdItems(){
        const self = Template.instance();
        if( !self.ronin.gtdItems ){
            self.ronin.gtdItems = [];
            gtd.items( 'projects' ).forEach( it => {
                self.ronin.gtdItems.push( it );
                self.ronin.$trees[it.id] = null;
            });
        }
        return self.ronin.gtdItems;
    },
    gtdLabel( item ){
        return gtd.labelItem( 'projects', item );
    },
    gtdRoute( item ){
        return gtd.routeItem( 'projects', item );
    },
    // class helper
    widthClass(){
        //return g.run.layout.get() === LYT_PAGE && g.run.width.get() < 400 ? 'with-icon': 'with-label';
        return g.run.width.get() < 400 ? 'with-icon': 'with-label';
    }
});

Template.projects_tabs.events({
    'click .js-collapse'( ev, instance ){
        const tab = Session.get( 'projects.tab.name' );
        const $tree = instance.ronin.$trees[tab];
        if( $tree ){
            $tree.trigger( 'projects-tree-collapse' );
        }
    },
    'click .js-dump'( ev, instance ){
        const tab = Session.get( 'projects.tab.name' );
        const $tree = instance.ronin.$trees[tab];
        if( $tree ){
            $tree.trigger( 'projects-tree-dump' );
        }
    },
    'click .js-expand'( ev, instance ){
        const tab = Session.get( 'projects.tab.name' );
        const $tree = instance.ronin.$trees[tab];
        if( $tree ){
            $tree.trigger( 'projects-tree-expand' );
        }
    },
    'click .js-rebuild'( ev, instance ){
        const tab = Session.get( 'projects.tab.name' );
        const $tree = instance.ronin.$trees[tab];
        if( $tree ){
            $tree.trigger( 'projects-tree-rebuild' );
        }
    }
});

Template.projects_tabs.onDestroyed( function(){
    //console.log( 'projects_tabs.onDestroyed' );
});
