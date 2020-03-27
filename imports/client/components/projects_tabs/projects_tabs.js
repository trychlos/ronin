/*
 * 'projects_tabs' component.
 *  Display projects and single actions as tabs.
 *
 *  Session variables:
 *  - projects.tab.name: the current tab.
 */
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/projects_tree/projects_tree.js';
import '/imports/client/interfaces/itabbed/itabbed.js';
import './projects_tabs.html';

Template.projects_tabs.fn = {
    // returns the tab whose tree holds this object (may be null)
    getObjectTab( instance, obj_id ){
        const tabs = Object.keys( instance.ronin.tabs );
        for( let i=0 ; i<tabs.length ; ++i ){
            if( Template.projects_tree.fn.tree_hasId( instance.ronin.tabs[tabs[i]], obj_id )){
                return tabs[i];
            }
        }
        return null;
    },
    // returns the tree held by this tab (may be null)
    getTabTree( instance, tab ){
        return instance.ronin.tabs[tab];
    }
};

Template.projects_tabs.onCreated( function(){
    //console.log( 'projects_tabs.onCreated' );
    this.ronin = {
        gtdItems: null,     // array of gtm items
        tabs: {}
    };
});

Template.projects_tabs.onRendered( function(){
    const self = this;
    const fn = Template.projects_tabs.fn;

    this.autorun(() => {
        $( '.projects-tabs' ).ITabbed({
            tab: Session.get( 'projects.tab.name' )
        });
    });

    // each tree advertises itself when it has finished its build
    $( '.projects-tabs' ).on( 'projects-tree-built', function( ev, o ){
        //console.log( ev );
        //console.log( o );
        self.ronin.tabs[o.tab] = o.$tree;
        $( '.projects-tabs' ).trigger( 'projects-tab-built', {
            tab: o.tab,
            view: self,
            projects_count: o.projects_count,
            actions_count: o.actions_count
        });
    });

    // it happends that the tree hierarchy does not react well to certains changes,
    //  and notably:
    //  - change of the parent of an action: the origin project is not updated
    //  - idem for the parent of a project
    //  - change of the future status of a project: the origin tab is not updated
    //  we so subscribe to the corresponding messages, and act accordingly
    jQuery.pubsub.subscribe( 'ronin.ui.item.updated', ( msg, o ) => {
        if( o.orig ){
            let orig = fn.getObjectTab( self, o.orig._id );
            if( orig ){
                self.ronin.tabs[orig].$tree.trigger( 'projects-tree-rebuild' );
            }
            if( o.edit && o.edit.parent !== o.orig.parent ){
                const dest = o.edit.parent ? fn.getObjectTab( self, o.edit.parent ) : 'gtd-review-projects-single';
                if( dest !== orig ){
                    self.ronin.tabs[dest].$tree.trigger( 'projects-tree-rebuild' );
                }
            }
        }
    });
});

Template.projects_tabs.helpers({
    gtdItems(){
        const self = Template.instance();
        if( !self.ronin.gtdItems ){
            self.ronin.gtdItems = gtd.items( 'projects' );
        }
        return self.ronin.gtdItems;
    },
    gtdLabel( it ){
        return gtd.labelItem( 'projects', it );
    },
    gtdRoute( it ){
        return gtd.routeItem( 'projects', it );
    },
});

Template.projects_tabs.onDestroyed( function(){
    //console.log( 'projects_tabs.onDestroyed' );
});
