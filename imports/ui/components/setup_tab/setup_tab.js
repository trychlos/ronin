/*
 * 'setup_tab' component.
 *  Display a tab per reference table.
 * 
 *  Parameters:
 *  - none
 * 
 *  Session variables:
 *  - setup.tab.name: the identifier of the active tab
 *      aka the identifier of the corresponding option in 'gtd' features.
 * 
 *  Reactive state:
 *  - rendered: true when the template has been rendered
 */
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';
import { gtd } from '/imports/ui/interfaces/gtd/gtd.js';
//import '/imports/ui/components/setup_contexts/setup_contexts.js';
//import '/imports/ui/components/setup_delegates/setup_delegates.js';
//import '/imports/ui/components/setup_energy/setup_energy.js';
//import '/imports/ui/components/setup_priority/setup_priority.js';
//import '/imports/ui/components/setup_refs/setup_refs.js';
//import '/imports/ui/components/setup_status/setup_status.js';
//import '/imports/ui/components/setup_time/setup_time.js';
//import '/imports/ui/components/setup_topics/setup_topics.js';
import '/imports/ui/interfaces/itabbed/itabbed.js';
import './setup_tab.html';

Template.setup_tab.fn = {
};

Template.setup_tab.onCreated( function(){
});

Template.setup_tab.onRendered( function(){
    this.autorun(() => {
        //console.log( 'setup_tab.onRendered tab='+Session.get('setup.tab.name'));
        $('.setup-tab').iTabbed({
            tab: Session.get('setup.tab.name')
        });
    })
});

Template.setup_tab.helpers({
    gtdSetup(){
        return gtd.setupItems();
    },
    itTemplate( it ){
        return 'setup_'+it.id;
    }
});

Template.setup_tab.events({
});
