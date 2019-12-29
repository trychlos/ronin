/*
 * 'setup_nmw' component.
 *  This is the main component of the 'setupPage' page.
 *  It manages the non modal window.
 * 
 *  Parameters:
 *  - none
 * 
 *  Session variables:
 *  - setup.tab.name: the identifier of the active tab
 *      aka the identifier of the corresponding option in 'gtd' features.
 */
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { gtd } from '/imports/ui/interfaces/gtd/gtd.js';
import '/imports/ui/components/setup_tab/setup_tab.js';
import '/imports/ui/interfaces/iwindowed/iwindowed.js';
import './setup_nmw.html';

Template.setup_nmw.fn = {
};

Template.setup_nmw.onCreated( function(){
});

Template.setup_nmw.onRendered( function(){
    this.$('.setup-nmw').iWindowed({
        id: 'setup-nmw'
    });
});

Template.setup_nmw.helpers({
});

Template.setup_nmw.events({
});
