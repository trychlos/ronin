/*
 * 'menu_bar' template.
 *  Horizontal menu on the (top) side of the page.
 *  Based on jQuery UI Menu widget.
 */
import { Session } from 'meteor/session';
import './menu_bar.html';

Template.menu_bar.fn = {
};

Template.menu_bar.onRendered( function(){
    $('.menu-bar').menu();
});

Template.menu_bar.helpers({
    gtdFeatures(){
        return gtdFeatures();
    },
});

Template.menu_bar.events({
});
