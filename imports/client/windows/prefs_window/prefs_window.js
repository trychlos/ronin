/*
 * 'prefsWindow' window.
 *  User preferences.
 */
import { Meteor } from 'meteor/meteor';
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/prefs_tabs/prefs_tabs.js';
import '/imports/client/components/wsf_collapse_buttons/wsf_collapse_buttons.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './prefs_window.html';

Template.prefsWindow.fn = {
    doClose( instance ){
        $().IWindowed.pageClose( instance.ronin.$dom );
    },
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

Template.prefsWindow.onCreated( function(){
    this.ronin = {
        $dom: null
    };

    // initialize the mobile datas for this window
    Session.set( 'header.title', null );
    Session.set( 'header.badges', {} );
});

Template.prefsWindow.onRendered( function(){
    const self = this;
    const fn = Template.prefsWindow.fn;
    const context = Template.currentData();
    self.ronin.$dom = self.$( '.'+context.template );

    this.autorun(() => {
        if( Ronin.ui.layouts[R_LYT_WINDOW].taskbar.get()){
            self.ronin.$dom.IWindowed({
                template: context.template,
                simone: {
                    buttons: [
                        {
                            text: "Close",
                            click: function(){
                                fn.doClose( self );
                            }
                        },
                        {
                            text: "OK",
                            click: function(){
                                fn.doOK( self );
                                fn.doClose( self );
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

Template.prefsWindow.events({
    'click .js-cancel'( ev, instance ){
        Template.prefsWindow.fn.doClose( instance );
        return false;
    },
    'click .js-ok'( ev, instance ){
        Template.prefsWindow.fn.doOK( instance );
        Template.prefsWindow.fn.doClose( instance );
        return false;
    }
});
