/*
 * 'header_panel' component.
 *  Display a navigation bar on top of the pages.
 *
 *  If the display is wide enough, the menu is displayed on the left side.
 *  Else, a button on the navbar let it be hide or shown.
 *
 *  In a browser window, the title is displayed as the browser tab title.
 *  Else, it is displayed here.
 *
 *  In a browser window, and if it is wide enough, an horizontal menu bar is displayed here.
 *
 *  A button let the user change the layout mode (desktop vs touchable device).
 *
 *  A button let the user sign in / sign out.
 */
import '/imports/client/components/layout_select/layout_select.js';
import '/imports/client/components/menu_bar/menu_bar.js';
import '/imports/client/components/menu_button/menu_button.js';
import './header_panel.html';

Template.header_panel.helpers({
    hasMenuBar(){
        return $(window).width() > 750;
    },
    // menu_side is 150px width, should not use more than 20% of the viewport
    // so, minimal width to have always shown side menu is 750
    hasMenuButton(){
        return $(window).width() < 750;
    },
    // browser (with a title bar and an url) is assumed if not running Cordova
    hasTitle(){
        return g.run.mobile;
    },
    // set a spacer between each element
    //  elements count is set on the instance itself
    preSpacer(){
        let count = Template.instance().eltCount;
        let spacer = '';
        if( !count ){
            count = 0;
        }
        if( count ){
            spacer = '<span class="spacer"></span>';
        }
        Template.instance().eltCount = 1+count;
        return spacer;
    },
    title(){
        const last = g.run.resize.get();    // be reactive vs orientation change
        const width = parseInt( $(window).innerWidth());
        let title = Session.get( 'header.title' );
        if( !title ){
            title = 'Ronin '+( width <= 480 ? 'rocks!' : 'takes care of your thoughts' );
        }
        return title;
    }
});
