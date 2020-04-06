/*
 * 'menu_button' template.
 *
 *  Display a button on the left of the navbar to open the menu.
 */
import bootbox from 'bootbox/dist/bootbox.all.min.js';
import './menu_button.html';

Template.menu_button.helpers({
    link( js, label ){
        return '<a class="'+js+' dropdown-item" href="javascript:void(0);">'+label+'</a>';
    }
});

Template.menu_button.events({
    'click .js-about'( ev, instance ){
        bootbox.alert({
            message: 'Ronin version '+Meteor.settings.public.ronin.version,
            closeButton: false
        });
    },
    'click .js-apk'( ev, instance ){
        FlowRouter.go( 'rt.gear.apk' );
    },
    'click .js-device'( ev, instance ){
        FlowRouter.go( 'rt.gear.device' );
    },
    'click .js-prefs'( ev, instance ){
        FlowRouter.go( 'rt.gear.prefs' );
    }
});
