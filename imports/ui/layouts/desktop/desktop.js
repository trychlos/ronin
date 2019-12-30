/*
 * 'appDesktop' layout.
 *  Main layout for desktop clients.
 */
import '/imports/ui/components/menu_side/menu_side.js';
import '/imports/ui/components/menu_bar/menu_bar.js';
import '/imports/ui/components/errors/errors.js';
import './desktop.html';

Template.appDesktop.onRendered( function(){
    $('.lyt-taskbar').taskbar({
        minimizeAll: false,
        windowButtonsSortable: false,
        windowsContainment: 'visible'
    });
});
