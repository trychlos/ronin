/*
 * 'lyt_footer_panel' component.
 *  Display a button fot each group of options, letting the user choose his page content.
 *
 *  Session variables:
 *  - page.group: the identifier of the GTD item to be activated here
 *      (maybe not anything to do with the actual current route, indeed).
 */
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import './lyt_footer_panel.html';

Template.lyt_footer_panel.helpers({
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

Template.lyt_footer_panel.events({
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