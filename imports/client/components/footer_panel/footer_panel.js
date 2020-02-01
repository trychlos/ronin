/*
 * 'footer_panel' component.
 *  Display a button fot each group of options, letting the user choose his page content.
 *
 *  Session variables:
 *  - gtd.last: the identifier of the GTD item to be activated here
 *      (maybe not anything to do with the actual current route, indeed).
 */
import { gtd } from '/imports/assets/gtd/gtd.js';
import './footer_panel.html';

Template.footer_panel.helpers({
    active( it ){
        const active = Session.get( 'gtd.last' );
        return active === it.id ? 'active' : '';
    },
    gtdItems(){
        return gtd.items( 'footer' );
    },
    gtdLabel( it ){
        return gtd.label( it );
    },
    gtdRoute( it ){
        return gtd.route( it );
    }
});

Template.footer_panel.events({
    'click .js-item'( event, instance ){
        const route = $( event.target ).data( 'pwi-iroutable-route' );
        FlowRouter.go( route );
        return false;
    }
});
