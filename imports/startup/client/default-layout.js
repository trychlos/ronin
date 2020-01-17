/*
 * /imports/startup/client/default-layout.js
 *
 *  Client UI initialization code.
 */
import 'amplifyjs';

LYT_TOUCH = 'appTouchable';
LYT_DESKTOP = 'appDesktop';

// g.dev records in local storage the last chosen layout
// g.app is reinitialized with the application (doesn't survive the application)
g = {
    dev: amplify.store( 'ronin.device' )
};

// defines a default layout
if( g.dev === undefined ){
    const touchable = $.jqx.mobile.isTouchDevice();
    g.dev = {
        isTouchDevice: touchable,
        layout: new ReactiveVar( touchable ? LYT_TOUCH : LYT_DESKTOP )
    };
    amplify.store( 'ronin.device', g.device );
}

// DEV
g.dev.layout = LYT_TOUCH;

g[LYT_TOUCH] = {};

g[LYT_DESKTOP] = {
    barSideWidth:   150,
    barTopHeight:    30,
    settingsPrefix: 'settings-',
    rootId:         '25d211fe-06ba-4781-ae41-c5a20e66075d',
    taskbar:         new ReactiveVar( null )
};
