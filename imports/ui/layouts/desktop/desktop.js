/*
 * 'appDesktop' layout.
 *  Main layout for desktop clients.
 */
import '/imports/ui/components/menu_side/menu_side.js';
import '/imports/ui/components/menu_bar/menu_bar.js';
import '/imports/ui/components/errors/errors.js';
import './desktop.html';

Template.appDesktop.onRendered( function(){
    g.taskbar.set(
        $('.lyt-taskbar').taskbar({
            minimizeAll: false,
            viewportMargins: {
                top   : [ g.barTopHeight, "correctNone" ],
                right : [              0, "correct" ],
                bottom: [              0, "correct" ],
                left  : [ g.barSideWidth, "correctNone" ]
            },
            windowButtonsSortable: false,
            windowsContainment: 'visible'
        })
    );
    //console.log( 'desktop set taskbar='+taskbar );
});
