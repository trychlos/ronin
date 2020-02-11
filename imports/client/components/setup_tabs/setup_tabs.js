/*
 * 'setup_tabs' component.
 *  Display a tab per reference table.
 *
 *  Session variables:
 *  - setup.tab.name: the identifier of the active tab
 *      aka the identifier of the corresponding option in 'gtd' features.
 */
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/setup_contexts/setup_contexts.js';
import '/imports/client/components/setup_delegates/setup_delegates.js';
import '/imports/client/components/setup_energy/setup_energy.js';
import '/imports/client/components/setup_priority/setup_priority.js';
import '/imports/client/components/setup_refs/setup_refs.js';
import '/imports/client/components/setup_time/setup_time.js';
import '/imports/client/components/setup_topics/setup_topics.js';
import '/imports/client/interfaces/itabbed/itabbed.js';
import './setup_tabs.html';

Template.setup_tabs.onRendered( function(){
    this.autorun(() => {
        $('.setup-tabbed').ITabbed({
            tab: Session.get('setup.tab.name')
        });
    })
});

Template.setup_tabs.helpers({
    gtdItems(){
        return gtd.items( 'setup' );
    },
    gtdLabel( it ){
        return gtd.labelItem( 'setup', it );
    },
    gtdRoute( it ){
        return gtd.routeItem( 'setup', it );
    },
    itTemplate( it ){
        return 'setup_'+it.id;
    }
});
