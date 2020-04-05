/*
 * 'footer_nav' component.
 *
 * 'pageLayout' sticky footer.
 *  Display a button for each group of options, letting the user choose his page content.
 *
 *  Session variables:
 *  - page.group: the identifier of the GTD item to be activated here
 *      (maybe not anything to do with the actual current route, indeed).
 */
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import './footer_nav.html';

Template.footer_nav.helpers({
    // activate in the footer the item which corresponds to the saved route
    active( it ){
        const active = Session.get( 'page.group' );
        return active === it.id ? 'active' : '';
    },
    gtdItems(){
        return gtd.items( 'footer' );
    },
    gtdLabel( it ){
        return gtd.labelItem( 'footer', it );
    }
});

Template.footer_nav.events({
    'click .js-item'( ev, instance ){
        const id = $( ev.target ).data( 'ronin-gtdid' );
        const route = gtd.routeId( 'footer', id );
        if( route ){
            FlowRouter.go( route );
        } else {
            console.log( 'route is undefined' );
        }
        return false;
    }
});
