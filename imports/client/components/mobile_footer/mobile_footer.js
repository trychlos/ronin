/*
 * 'mobile_footer' component.
 *  Display a button fot each group of options, letting the user choose his page content.
 */
import { gtd } from '/imports/client/interfaces/gtd/gtd.js';
//import '/imports/client/components/setup_contexts/setup_contexts.js';
//import '/imports/client/components/setup_delegates/setup_delegates.js';
//import '/imports/client/components/setup_energy/setup_energy.js';
//import '/imports/client/components/setup_priority/setup_priority.js';
//import '/imports/client/components/setup_refs/setup_refs.js';
//import '/imports/client/components/setup_time/setup_time.js';
//import '/imports/client/components/setup_topics/setup_topics.js';
//import '/imports/client/interfaces/itabbed/itabbed.js';
import './mobile_footer.html';

Template.mobile_footer.onRendered( function(){
    //$( '.mobile-tabbed' ).ITabbed();
});

Template.mobile_footer.helpers({
    gtdItems(){
        return gtd.mobileItems();
    },
    itTemplate( it ){
        return 'setup_'+it.id;
    }
});
