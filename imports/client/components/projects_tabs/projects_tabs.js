/*
 * 'projects_tabs' component.
 *  Display projects and single actions as tabs.
 *
 *  Session variables:
 *  - projects.tab.name: the current tab.
 */
import { gtd } from '/imports/assets/gtd/gtd.js';
import '/imports/client/components/projects_tree/projects_tree.js';
import '/imports/client/interfaces/itabbed/itabbed.js';
import './projects_tabs.html';

Template.projects_tabs.onRendered( function(){
    $('.projects-tabbed').ITabbed({
        tab: Session.get( 'projects.tab.name' )
    });
});

Template.projects_tabs.helpers({
    gtdItems(){
        return gtd.items( 'projects' );
    },
    gtdLabel( item ){
        return gtd.labelItem( 'projects', item );
    },
    gtdRoute( item ){
        return gtd.routeItem( 'projects', item );
    }
});
