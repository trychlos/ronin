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
 *  So:
 *  - touch device: layout is page-based (header+scrollable content+footer)
 *  - desktop(+mouse) device: layout is window-based, using Simone window manager.
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
        layout: new ReactiveVar()
    }
};

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
g.run.layout.set( g.detectIt.primaryInput === 'mouse' ? LYT_DESKTOP : LYT_TOUCH );

// DEVELOPMENT SURCHARGE
g.run.mobile = true;
g.run.layout.set( LYT_TOUCH );
