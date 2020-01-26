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
 *  In a mobile (Cordova) application, routes are not displayed as they are in
 *  a web browser, but even if routes are not directly available to the user,
 *  they are still handled under the hood.
 *
 *  So, we must deal with three runtime environments:
 *
 *  1. Cordova simulation of a mobile application
 *  2. web browser on a touch device
 *
 *      These two runtime environments are quite similar in that they are both
 *      page-based. On our case, this means that they are all built around a
 *      navbar header + some scrollable content + a sticky footer.
 *
 *      > page-based layout
 *      > layout='touchableLayout'
 *
 *      Differences come only from the available display size which may range
 *      from very small (smartphone) to very large (high-res tv). They are for
 *      now resolved through CSS media queries. Some menu-driven layout changes
 *      may be planned later depending of identified use cases.
 *
 *  3. web browser on a desktop (+mouse) device
 *      > window-based layout (using Simone window manager)
 *      > layout='desktopLayout'.
 */
import detectIt from 'detect-it';

// 'g' is our global, anywhere-available, variable, and exhibits:
//
//  - detectIt: the result of the detectIt module
//              https://www.npmjs.com/package/detect-it
//
//  - run: the runtime variables
//              automatically initialized from runtime detection
//              overridable by the user (mostly for development purpose).
g = {
    detectIt: detectIt,
    run: {
        mobile: Meteor.isCordova,
        layout: new ReactiveVar( null ),
        resize: new ReactiveVar( null )
    }
};

// mobile device (without mouse, run through Cordova, not a browser)
//  size from smartphone to the TV
LYT_MOBILE = 'mobileLayout';
g[LYT_MOBILE] = {};

// touchable device (a browser without mouse, not Cordova)
//  size from smartphone to the TV
LYT_TOUCH = 'touchableLayout';
g[LYT_TOUCH] = {};

// desktop layout
//  requires a mouse as it makes use of Simone window manager
LYT_DESKTOP = 'desktopLayout';
g[LYT_DESKTOP] = {
    barSideWidth:   150,
    barTopHeight:    30,
    settingsPrefix: 'settings-',
    rootId:         '25d211fe-06ba-4781-ae41-c5a20e66075d',
    taskbar:         new ReactiveVar( null )
};

// set a default page for the touchable layouts
const page = Session.get( 'touch.route' );
if( !page ){
    Session.set( 'touch.route', 'collect' );
}

// layout initialization
g.run.layout.set( g.detectIt.primaryInput === 'mouse' ? LYT_DESKTOP : LYT_TOUCH );

// DEVELOPMENT SURCHARGE
g.run.mobile = true;
g.run.layout.set( LYT_TOUCH );
