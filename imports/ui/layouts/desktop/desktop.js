/*
 * 'appDesktop' layout.
 *  Main layout for desktop clients.
 */
import '/imports/ui/components/errors/errors.js';
import '/imports/ui/components/menu_side/menu_side.js';
import '/imports/ui/components/menu_bar/menu_bar.js';
import '/imports/ui/components/overview/overview.js';
import './desktop.html';

Template.appDesktop.onRendered( function(){
    g.taskbar.set(
        $('.lyt-taskbar').taskbar({
            //buttonsTooltips: true,
            localization: {
                en: {
                    'group:collectWindow': 'Collect',
                    'group:processWindow': 'Process',
                    'group:reviewWindow':  'Review',
                    'group:setupWindow':   'Setup'
                }
            },
            minimizeAll: false,
            viewportMargins: {
                top   : [ g.barTopHeight, "correctNone" ],
                left  : [ g.barSideWidth, "correctNone" ]
            },
            windowButtonsSortable: false,
            windowsContainment: 'visible'
        })
    );
    //console.log( 'desktop set taskbar='+taskbar );
});

Template.appDesktop.helpers({
    rootId(){
        return g.rootId;
    }
});
