/*
 * 'windowLayout' layout.
 *  Main layout for desktop (mouse-driven) clients.
 *
 *  This layout makes use of the Simone window manager to display each and
 *  every pages (inside so-called windows).
 *
 *  Worflow:
 *  [routes.js]
 *      +-> windowLayout { group, page, window }
 *
 *  The layout receives three parameters from the route manager.
 *  It consumes one of them to dynamically display the page template, and sends
 *  the two others as a data context to this page (here, to display the window).
 *
 *  Route-provided parameters:
 *  - 'group': the identifier of this features's group
 *  - 'page': the name of the primary page
 *  - 'window': the window to be run by this 'page' page.
 */
import '/imports/client/components/message/message.js';
import '/imports/client/components/menu_side/menu_side.js';
import '/imports/client/components/menu_bar/menu_bar.js';
import '/imports/client/components/overview/overview.js';
import './window_layout.html';

Template.windowLayout.onRendered( function(){
    const taskbar = $('.lyt-taskbar').taskbar({
        //buttonsTooltips: true,
        localization: {
            en: {
                'group:collectWindow':  'Collect',
                'group:processWindow':  'Process',
                'group:reviewWindow':   'Review',
                'group:setupWindow':    'Setup'
            }
        },
        minimizeAll: false,
        viewportMargins: {
            top   : [ g[LYT_WINDOW].barTopHeight, "correctNone" ],
            left  : [ g[LYT_WINDOW].barSideWidth, "correctNone" ]
        },
        windowButtonsSortable: false,
        windowsContainment: 'visible'
    });
    g[LYT_WINDOW].taskbar.set( taskbar );
    //console.log( 'desktop set taskbar' );
    //console.log( taskbar );
    taskbar.on( 'taskbarbind', function( ev, ui ){
        //console.log( 'taskbar bind '+ui.$window[0].baseURI );
        //console.log( ev );
        //console.log( ui );
    });
    // reset route when closing the last window
    taskbar.on( 'taskbarunbind', function( ev, ui ){
        if( ui.instance.windows().length === 0 ){
            FlowRouter.go( 'home' );
        }
    });
});

Template.windowLayout.helpers({
    rootId(){
        return g[LYT_WINDOW].rootId;
    }
});
