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
    alwaysVisible: [
        'gtd-review-projects-current',
        'gtd-review-projects-future'
    ]
};

Template.projects_tabs.onCreated( function(){
    this.ronin = {
        dict:  new ReactiveDict(),
        tabs_count: 0
    };
    this.ronin.dict.set( 'count', 0 );
});

Template.projects_tabs.onRendered( function(){
    const self = this;

    this.autorun(() => {
        $( '.projects-tabbed' ).ITabbed({
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
        if( count === self.ronin.tabs_count ){
            $( ev.target ).trigger( 'projects-tabs-built', { count:count });
        }
    });
});

Template.projects_tabs.helpers({
    gtdItems(){
        const items = gtd.items( 'projects' );
        const self = Template.instance();
        self.ronin.tabs_count = items.length;
        return items;
    },
    gtdLabel( item ){
        return gtd.labelItem( 'projects', item );
    },
    gtdRoute( item ){
        return gtd.routeItem( 'projects', item );
    },
    // class helper
    //  limiting to two tabs in pageLayout if width < 480
    isVisible( item ){
        let visible = '';
        if( g.run.layout.get() === LYT_PAGE && g.run.width.get() < 480 ){
            const fn = Template.projects_tabs.fn;
            if( !fn.alwaysVisible.includes( item.id )){
                visible = 'x-hidden';
            }
        }
        return visible;
    }
});
