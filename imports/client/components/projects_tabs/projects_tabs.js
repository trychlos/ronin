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
    this.ronin = {
        dict:  new ReactiveDict(),
        total: 0
    };
    this.ronin.dict.set( 'count', 0 );
});

Template.projects_tabs.onRendered( function(){
    $('.projects-tabbed').ITabbed({
        tab: Session.get( 'projects.tab.name' )
    });
});

Template.projects_tabs.helpers({
    gtdItems(){
        const items = gtd.items( 'projects' );
        const self = Template.instance();
        self.ronin.total = items.length;
        return items;
    },
    gtdLabel( item ){
        return gtd.labelItem( 'projects', item );
    },
    gtdRoute( item ){
        return gtd.routeItem( 'projects', item );
    },
});

Template.projects_tabs.events({
    // when all the trees have been rendered, advertise the window
    //  NB: triggering an event to the window doesn't work in windowLayout
    'projects-tree-built .projects-tabs'( ev, instance ){
        let count = instance.ronin.dict.get( 'count' );
        count += 1;
        instance.ronin.dict.set( 'count', count );
        if( count === instance.ronin.total ){
            $( ev.target ).trigger( 'projects-tabs-built', count );
            $.pubsub.publish( 'ronin.ui.spinner.stop' );
        }
    }
});
