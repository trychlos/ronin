/*
 * 'setup' component.
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
//import '/imports/ui/interfaces/iwindowed/iwindowed.js';
import './setup.html';

Template.setup.fn = {
    close: function(){
        console.log( 'close' );
        $('div.setup-page div.setup').remove();
    },
    restoreSettings: function(){
        var $dialog = $('div.setup-page div.setup');
        var storageName = "windowSettings";
        if (localStorage[storageName]) {
            var settings = JSON.parse(localStorage[storageName]);
            console.log( 'restoreSettings '+settings );
            $dialog.window("option", "position", {
                my: settings.my,
                at: settings.at,
                of: window,
                collision: 'fit'
            });
            $dialog.window("option", "width", settings.width);
            $dialog.window("option", "height", settings.height);
            $dialog.window("refreshPosition");
        }
    },
    saveSettings: function(){
        var $dialog = $('div.setup-page div.setup');
        var storageName = "windowSettings";
        var position = $dialog.window("option", "position");
        var settings = {};
        settings.width = $dialog.window("option", "width");
        settings.height = $dialog.window("option", "height");
        settings.at = position.at;
        settings.my = position.my;
        var jsonSettings = JSON.stringify(settings);
        localStorage[storageName] = JSON.stringify(settings);
        console.log( 'saveSettings '+ JSON.stringify(settings));
    }
};

Template.setup.onCreated( function(){
});

Template.setup.onRendered( function(){
    this.autorun(() => {
        if( g.taskbar.get()){
            $('div.setup-page div.setup').window({
                appendTo: 'div.setup-page',
                beforeClose: Template.setup.fn.saveSettings,
                close: Template.setup.fn.close,
                group: 'setup',
                taskbar: g.taskbar.get(),
                title: 'Setup',
                widgetClass: 'w-setup'
            });
            Template.setup.fn.restoreSettings();
        }
    });
});

Template.setup.helpers({
});

Template.setup.events({
});
