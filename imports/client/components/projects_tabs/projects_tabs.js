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
            if( Template.projects_tree.fn.tree_hasId( instance.ronin.tabs[tabs[i]].$tree, obj_id )){
                return tabs[i];
            }
        }
        return null;
    },
    // returns the tree held by this tab (may be null)
    getTabTree( instance, tab ){
        return instance.ronin.tabs[tab].$tree;
    }
};

Template.projects_tabs.onCreated( function(){
    const self = this;

    //console.log( 'projects_tabs.onCreated' );
    this.ronin = {
        gtdItems: gtd.items( 'projects' ),
        tabs: {
            'gtd-review-projects-current': {
                action: new Ronin.ActionEx({
                    type: R_OBJ_PROJECT,
                    action: R_ACT_NEW,
                    gtd: 'gtd-process-project-new'
                }),
                $tree: null
            },
            'gtd-review-projects-single': {
                action: new Ronin.ActionEx({
                    type: R_OBJ_ACTION,
                    action: R_ACT_NEW,
                    gtd: 'gtd-process-action-new'
                }),
                $tree: null
            },
            'gtd-review-projects-future': {
                action: new Ronin.ActionEx({
                    type: R_OBJ_PROJECT,
                    action: R_ACT_NEW,
                    gtd: 'gtd-process-project-new'
                }),
                $tree: null
            }
        }
    };

    // new actions default to be activable
    Object.keys( this.ronin.tabs ).forEach( gtdid => {
        self.ronin.tabs[gtdid].action.activable( true );
    });
});

Template.projects_tabs.onRendered( function(){
    const self = this;
    const fn = Template.projects_tabs.fn;

    this.autorun(() => {
        const tab = Session.get( 'projects.tab.name' );
        $( '.projects-tabs' ).ITabbed({ tab:tab });
        const pv = self.view.parentView;    // aka Template.projectsList
        pv.template.fn.newAction( pv._templateInstance, self.ronin.tabs[tab].action );
    });

    // each tree advertises itself when it has finished its build
    //  this is handled by the projectsList window
    $( '.projects-tabs' ).on( 'projects-tree-built', function( ev, o ){
        //console.log( ev );
        //console.log( o );
        self.ronin.tabs[o.tab].$tree = o.$tree;
        $( '.projects-tabs' ).trigger( 'projects-tab-ready', {
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
        return Template.instance().ronin.gtdItems;
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
