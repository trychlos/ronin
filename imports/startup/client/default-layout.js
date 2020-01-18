/*
 * /imports/startup/client/default-layout.js
 *
 *  Client UI initialization code.
 *  One more time: this is ONLY run at startup.
 */
import 'amplifyjs';

LYT_TOUCH = 'appTouchable';
LYT_DESKTOP = 'appDesktop';

// g.device.lastLayout records in local storage the last chosen layout
g = {
    device: {
        touchDevice: $.jqx.mobile.isTouchDevice(),          // dynamic at run time
        lastLayout: amplify.store( 'ronin.lastLayout' ),    // locally stored
        curLayout: new ReactiveVar()                        // display reactive var
    }
};

g.device.curLayout.set(
    g.device.lastLayout === undefined
        ? ( g.device.touchDevice ? LYT_TOUCH : LYT_DESKTOP )
        :   g.device.lastLayout );

// DEV
g.device.curLayout.set( LYT_TOUCH );

// touchable device (without mouse)
g[LYT_TOUCH] = {};

// desktop device (aka the user has a mouse)
g[LYT_DESKTOP] = {
    barSideWidth:   150,
    barTopHeight:    30,
    settingsPrefix: 'settings-',
    rootId:         '25d211fe-06ba-4781-ae41-c5a20e66075d',
    taskbar:         new ReactiveVar( null )
};

const curLayout = g.device.curLayout.get();
switch( curLayout ){
    case LYT_DESKTOP:
        break;
    case LYT_TOUCH:
        const tab = Session.get( 'mobile.tab.name' );
        if( !tab ){
            Session.set( 'mobile.tab.name', 'collect' );
        }
        //FlowRouter.go( 'home' );
        break;
    default:
        console.log( curLayout+': unknown layout' );
}
