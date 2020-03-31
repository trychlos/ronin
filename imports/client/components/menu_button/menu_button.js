/*
 * 'menu_button' template.
 *
 *  Display a button on the left of the navbar to open the menu.
 */
import bootbox from 'bootbox/dist/bootbox.all.min.js';
import './menu_button.html';

Template.menu_button.fn = {
    recordBack(){
        const route = FlowRouter.current();
        const name = route.route.name;
        if( !name.startsWith( 'rt.gear.' )){
            g.run.back = route.path;
        }
    }
};

Template.menu_button.events({
    'click .js-about'( ev, instance ){
        bootbox.alert({
            message: 'Ronin version '+Meteor.settings.public.ronin.version,
            closeButton: false
        });
    },
    'click .js-apk'( ev, instance ){
        Template.menu_button.fn.recordBack();
        FlowRouter.go( 'rt.gear.apk' );
    },
    'click .js-device'( ev, instance ){
        Template.menu_button.fn.recordBack();
        FlowRouter.go( 'rt.gear.device' );
    },
    'click .js-prefs'( ev, instance ){
        Template.menu_button.fn.recordBack();
        FlowRouter.go( 'rt.gear.prefs' );
    }
});
