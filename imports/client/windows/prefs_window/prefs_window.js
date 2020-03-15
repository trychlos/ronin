/*
 * 'prefsWindow' window.
 *  User preferences.
 */
import { Meteor } from 'meteor/meteor';
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/prefs_tabs/prefs_tabs.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './prefs_window.html';

Template.prefsWindow.fn = {
    doOK( self ){
        Template.prefs_lists_panel.fn.doOK();
    },
    getDeviceStorageName(){
        const user = Meteor.user();
        let address = 'default';
        if( user && user.emails && user.emails[0] && user.emails[0].address ){
            address = user.emails[0].address;
        }
        const name = 'ronin-prefs-device-'+address;
        //console.log( 'name='+name );
        return name;
    },
    readDevicePrefs(){
        const fn = Template.prefsWindow.fn;
        const name = fn.getDeviceStorageName();
        let prefs = null;
        if( localStorage[name] ){
            prefs = JSON.parse( localStorage[name] );
        }
        //console.log( prefs );
        return( prefs );
    },
    writeDevicePrefs( prefs ){
        const fn = Template.prefsWindow.fn;
        const name = fn.getDeviceStorageName();
        localStorage[name] = JSON.stringify( prefs );
    }
};

Template.prefsWindow.onRendered( function(){
    const self = this;

    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            const context = Template.currentData();
            $( '.'+context.template ).IWindowed({
                template: context.template,
                simone: {
                    buttons: [
                        {
                            text: "Close",
                            click: function(){
                                $().IWindowed.close( '.'+context.template );
                            }
                        },
                        {
                            text: "OK",
                            click: function(){
                                Template.prefsWindow.fn.doOK( self );
                                $().IWindowed.close( '.'+context.template );
                            }
                        }
                    ],
                    group: context.group,
                    title: gtd.labelId( null, context.gtdid )
                }
            });
        }
    });
});