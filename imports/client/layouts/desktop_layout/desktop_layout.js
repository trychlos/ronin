/*
 * 'desktopLayout' layout.
 *  Main layout for desktop clients.
 *
 *  This layout makes use of the Simone window manager to display each and
 *  every pages (inside so-called windows).
 *
 *  Parameters:
 *  - main: name of the template to be displayed (from routes.js)
 */
import '/imports/client/components/errors/errors.js';
import '/imports/client/components/menu_side/menu_side.js';
import '/imports/client/components/menu_bar/menu_bar.js';
import '/imports/client/components/overview/overview.js';
import './desktop_layout.html';

Template.desktopLayout.onRendered( function(){
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
            top   : [ g[LYT_DESKTOP].barTopHeight, "correctNone" ],
            left  : [ g[LYT_DESKTOP].barSideWidth, "correctNone" ]
        },
        windowButtonsSortable: false,
        windowsContainment: 'visible'
    });
    g[LYT_DESKTOP].taskbar.set( taskbar );
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

Template.desktopLayout.helpers({
    rootId(){
        return g[LYT_DESKTOP].rootId;
    }
});
