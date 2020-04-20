/*
 * ronin-ui-prefs package
 *  lib/user_prefs.js
 *
 * Reactively read user preferences from Users collection.
 * Reactively read device user preferences from local storage.
 */
import { Meteor } from 'meteor/meteor';
import { reactiveLocalStorage } from 'meteor/mdj:reactive-storage';
import { Ronin } from 'meteor/pwi:ronin-core';

const _default = {
    prefs: {
        local: {}
    }
};

let _prefs = {};

_globalWrite = () => {
}

_localName = () => {
    const user = Meteor.user();
    let address = 'default';
    if( user && user.emails && user.emails[0] && user.emails[0].address ){
        address = user.emails[0].address;
    }
    return 'ronin-localPrefs-'+Ronin.ui.runLayout()+'-'+address;
}

_localRead = () => {
    return JSON.parse( reactiveLocalStorage.getItem( _localName()) || "{}" );
}

_localWrite = ( o=_default ) => {
    reactiveLocalStorage.setItem( _localName(), JSON.stringify( o ));
}

Tracker.autorun(() => {
    $.extend( true, Ronin, _default );
    if( Meteor.userId()){
        const user = Meteor.user();
        if( user && user.ronin ){
            $.extend( true, Ronin.prefs, user.ronin.prefs );
        }
    }
    $.extend( true, Ronin.prefs.local, _localRead());
    _prefs = $.extend( true, {}, Ronin.prefs );
});

Ronin.prefs.save = () => {
    if( Meteor.userId()){
        _globalWrite( );
    }
    _localWrite( Ronin.prefs.local );
}
