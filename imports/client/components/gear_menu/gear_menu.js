/*
 * 'gear_menu' template.
 *
 *  Display a button on the left of the navbar to open the menu.
 */
import bootbox from 'bootbox/dist/bootbox.all.min.js';
import './gear_menu.html';

Template.gear_menu.helpers({
    link( js, label ){
        return '<a class="'+js+' dropdown-item" href="javascript:void(0);">'+label+'</a>';
    }
});

Template.gear_menu.events({
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
