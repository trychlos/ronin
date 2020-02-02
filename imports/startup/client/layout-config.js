/*
 * /imports/startup/client/layout-config.js
 *
 *  Client UI initialization code (this is ONLY run at startup).
 *
 *  Depending of the running device, we will run here:
 *  - either a window-based layout,
 *  - or a page-base layout.
 *
 *  These two layouts are logical ones.
 *  We keep a single one layout 'appLayout' template.
 *  This template dynamically set a layout-dependant class on the topmost div:
 *  - ronin-page-layout
 *  - ronin-window-layout.
 *
 *  Note that what is known as 'window-based' layout is mostly attached to the
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
 *
 *      Differences come only from the available display size which may range
 *      from very small (smartphone) to very large (high-res tv). They are for
 *      now resolved through CSS media queries. Some menu-driven layout changes
 *      may be planned later depending of identified use cases.
 *
 *  3. web browser on a desktop (+mouse) device
 *      > window-based layout (using Simone window manager).
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

// page-based layout, for a touchable device (a browser without mouse, or Cordova)
//  size from smartphone to the TV
LYT_PAGE = 'pageLayout';
g[LYT_PAGE] = {};

// window-based (aka desktop) layout
//  requires a mouse as it makes use of Simone window manager
LYT_WINDOW = 'windowLayout';
g[LYT_WINDOW] = {
    barSideWidth:   150,
    barTopHeight:    30,
    settingsPrefix: 'settings-',
    rootId:         '25d211fe-06ba-4781-ae41-c5a20e66075d',
    taskbar:         new ReactiveVar( null )
};

// set a default route for the page-based layouts
// NB: the 'gtd.last' holds the last active GTD group item identifier
const page = Session.get( 'gtd.last' );
if( !page ){
    Session.set( 'gtd.last', 'collect' );
}

// layout initialization
g.run.layout.set( g.detectIt.primaryInput === 'mouse' ? LYT_WINDOW : LYT_PAGE );

// DEVELOPMENT SURCHARGE
//g.run.mobile = true;
//g.run.layout.set( LYT_PAGE );
