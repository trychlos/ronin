/*
 * 'mobile_footer' component.
 *  Display a button fot each group of options, letting the user choose his page content.
 *
 *  Session variables:
 *  - touch.route: the identifier of the active page
 *      aka the identifier of the corresponding option in 'gtd' features.
 */
import { gtd } from '/imports/assets/gtd/gtd.js';
//import '/imports/client/components/setup_contexts/setup_contexts.js';
//import '/imports/client/components/setup_delegates/setup_delegates.js';
//import '/imports/client/components/setup_energy/setup_energy.js';
//import '/imports/client/components/setup_priority/setup_priority.js';
//import '/imports/client/components/setup_refs/setup_refs.js';
//import '/imports/client/components/setup_time/setup_time.js';
//import '/imports/client/components/setup_topics/setup_topics.js';
//import '/imports/client/interfaces/itabbed/itabbed.js';
import './mobile_footer.html';

Template.mobile_footer.helpers({
    active( it ){
        const page = Session.get( 'touch.route' );
        return page === it.router ? 'active' : '';
    },
    gtdItems(){
        return gtd.touchItems();
    },
    gtdLabel( it ){
        return gtd.touchLabel( it );
    }
});

Template.mobile_footer.events({
    'click .js-item'( event, instance ){
        const route = $( event.target ).data( 'pwi-iroutable-route' );
        FlowRouter.go( route );
        return false;
    }
});
