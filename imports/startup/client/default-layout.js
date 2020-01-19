/*
 * /imports/startup/client/default-layout.js
 *
 *  Client UI initialization code.
 *  One more time: this is ONLY run at startup.
 *
 *  Note that what is known as 'desktop' layout is mostly attached to the
 *  presence of a mouse which let the user manages the displayed windows.
 *  This also usually means (and we'll assume) that:
 *  1. we are inside of a web browser
 *  2. the viewport is large enough to show all what we need.
 *  In this first case, we promote the usage of Simone window manager.
 *
 *  Contrarily, if no mouse is attached to the system, the layout must be
 *  page-based.
 *
 *  More, inside of a web browser, routes must be handled. They may safely
 *  be ignored when running as a native mobile application (as a Cordova
 *  one actually).
 *
 *  Last, the layout on a mobile device with a small width (a smartphone !)
 *  is fixed with a header, a scrollable content and a footer.
 */
import 'amplifyjs';
import detectIt from 'detect-it';

// 'g' is our global, anywhere-available, variable, and exhibits:
//
//  - ronin: a local storage proxy
//              layout: the last chosen layout
//              mobile: the last viewed tab
//
//  - detectIt: the result of the detectIt module
//              https://www.npmjs.com/package/detect-it
//
//  - the runtime variables
//              automatically initialized from runtime detection
//              overridable by the user.
g = {
    store: amplify.store( 'ronin' ),
    detectIt: detectIt,
    run: {
        mobile: Meteor.isCordova,
        layout: new ReactiveVar()
    }
};
if( g.store === undefined ){
    g.store = {};
}

// touchable device (without mouse, maybe not Cordova)
LYT_TOUCH = 'appTouchable';
g[LYT_TOUCH] = {};

// desktop layout
//  requires a mouse as it makes use of Simone window manager
LYT_DESKTOP = 'appDesktop';
g[LYT_DESKTOP] = {
    barSideWidth:   150,
    barTopHeight:    30,
    settingsPrefix: 'settings-',
    rootId:         '25d211fe-06ba-4781-ae41-c5a20e66075d',
    taskbar:         new ReactiveVar( null )
};

// layout initialization
g.run.layout.set(
    g.store.layout === undefined
        ? ( g.detectIt.hasMouse ? LYT_DESKTOP : LYT_TOUCH )
        :   g.store.layout );

// DEVELOPMENT SURCHARGE
g.run.mobile = true;
g.run.layout.set( LYT_TOUCH );

// set some suitable defaults if we do not handle routes
const layout = g.run.layout.get();
switch( layout ){
    case LYT_DESKTOP:
        break;
    case LYT_TOUCH:
        let tab = Session.get( 'mobile.tab.name' );
        if( !tab ){
            tab = g.store.mobile;
            if( !tab ){
                tab = 'collect';
            }
            Session.set( 'mobile.tab.name', 'collect' );
        }
        //FlowRouter.go( 'home' );
        break;
    default:
        console.log( layout+': unknown layout' );
}

g.store.layout = layout;
g.store.mobile = Session.get( 'mobile.tab.name' );
amplify.store( 'ronin', g.store );
