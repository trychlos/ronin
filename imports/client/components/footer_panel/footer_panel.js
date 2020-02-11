/*
 * 'footer_panel' component.
 *  Display a button fot each group of options, letting the user choose his page content.
 *
 *  Session variables:
 *  - gtd.group: the identifier of the GTD item to be activated here
 *      (maybe not anything to do with the actual current route, indeed).
 */
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import './footer_panel.html';

Template.footer_panel.helpers({
    active( it ){
        const active = Session.get( 'gtd.group' );
        return active === it.id ? 'active' : '';
    },
    gtdItems(){
        return gtd.items( 'footer' );
    },
    gtdLabel( it ){
        return gtd.labelItem( 'footer', it );
    },
    gtdRoute( it ){
        return gtd.routeItem( 'footer', it );
    }
});

Template.footer_panel.events({
    'click .js-item'( ev, instance ){
        const route = $( ev.target ).attr( 'data-route' );
        FlowRouter.go( route );
        return false;
    }
});
