/*
 * 'setup_tabs' component.
 *  Display a tab per reference table.
 * 
 *  Session variables:
 *  - setup.tab.name: the identifier of the active tab
 *      aka the identifier of the corresponding option in 'gtd' features.
 */
import { gtd } from '/imports/ui/interfaces/gtd/gtd.js';
import '/imports/ui/components/setup_contexts/setup_contexts.js';
import '/imports/ui/components/setup_delegates/setup_delegates.js';
import '/imports/ui/components/setup_energy/setup_energy.js';
import '/imports/ui/components/setup_priority/setup_priority.js';
import '/imports/ui/components/setup_refs/setup_refs.js';
import '/imports/ui/components/setup_status/setup_status.js';
import '/imports/ui/components/setup_time/setup_time.js';
import '/imports/ui/components/setup_topics/setup_topics.js';
import '/imports/ui/interfaces/itabbed/itabbed.js';
import './setup_tabs.html';

Template.setup_tabs.fn = {
};

Template.setup_tabs.onCreated( function(){
});

Template.setup_tabs.onRendered( function(){
    this.autorun(() => {
        //console.log( 'setup_tabs.onRendered tab='+Session.get('setup.tab.name'));
        $('.setup-tabbed').iTabbed({
            tab: Session.get('setup.tab.name')
        });
    })
});

Template.setup_tabs.helpers({
    gtdSetup(){
        return gtd.setupItems();
    },
    itTemplate( it ){
        return 'setup_'+it.id;
    }
});

Template.setup_tabs.events({
});
