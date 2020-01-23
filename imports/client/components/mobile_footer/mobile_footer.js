/*
 * 'mobile_footer' component.
 *  Display a button fot each group of options, letting the user choose his page content.
 *
 *  Session variables:
 *  - mobile.page: the identifier of the active page
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

Template.mobile_footer.onRendered( function(){
    let page = Session.get('mobile.page');
    console.log( 'mobile_footer.onRendered: mobile.page='+page );
    if( !page ){
        Session.set( 'mobile.page', 'collect' );
    }
});

Template.mobile_footer.helpers({
    active( it ){
        const page = Session.get('mobile.page');
        return page === it.id ? 'active' : '';
    },
    gtdItems(){
        return gtd.mobileItems();
    }
});

Template.mobile_footer.events({
    'click .js-item'( event, instance ){
        //console.log( event );
        const a = event.target.href.split( '#' );
        const href = a[a.length-1];
        //console.log( 'a='+event.target.href+' href='+href );
        console.log( 'set mobile.page='+href );
        Session.set( 'mobile.page', href );
        //console.log( 'Set mobile.tab.name='+href );
        const route = $(event.target).data( 'pwi-iroutable-route' );
        //console.log( 'route='+route);
        FlowRouter.go( route );
        return false;
    }
});
