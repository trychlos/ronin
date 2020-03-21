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

Template.projects_tabs.fn = {
    // search the built trees for the one which holds this object
    getTab( instance, obj_id ){
        const items = instance.ronin.gtdItems || [];
        for( let i=0 ; i<items.length ; ++i ){
            if( Template.projects_tree.fn.tree_hasId( instance.ronin.$trees[items[i].id], obj_id )){
                return items[i].id;
            }
        }
        return null;
    }
};

Template.projects_tabs.onCreated( function(){
    //console.log( 'projects_tabs.onCreated' );
    this.ronin = {
        dict:  new ReactiveDict(),
        gtdItems: null,     // array of gtm items
        $trees: {}          // hash gtd_id -> $tree
    };
    this.ronin.dict.set( 'count', 0 );
});

Template.projects_tabs.onRendered( function(){
    const self = this;
    const fn = Template.projects_tabs.fn;

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

    // it happends that the tree hierarchy does not react well to certains changes,
    //  and notably:
    //  - change of the parent of an action: the origin project is not updated
    //  - idem for the parent of a project
    //  - change of the future status of a project: the origin tab is not updated
    //  we so subscribe to the corresponding messages, and act accordingly
    jQuery.pubsub.subscribe( 'ronin.ui.item.updated', ( msg, o ) => {
        if( o.orig ){
            let orig = fn.getTab( self, o.orig._id );
            if( orig ){
                self.ronin.$trees[orig].trigger( 'projects-tree-rebuild' );
            }
            if( o.edit && o.edit.parent !== o.orig.parent ){
                const dest = o.edit.parent ? fn.getTab( self, o.edit.parent ) : 'gtd-review-projects-single';
                if( dest !== orig ){
                    self.ronin.$trees[dest].trigger( 'projects-tree-rebuild' );
                }
            }
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
