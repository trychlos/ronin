/*
 * 'lyt_header_panel' component.
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
 *  Available buttons:
 *  - change the layout mode (desktop vs touchable device)
 *  - let the user sign in / sign out.
 */
import '/imports/client/components/layout_select/layout_select.js';
import '/imports/client/components/menu_bar/menu_bar.js';
import '/imports/client/components/menu_button/menu_button.js';
import '/imports/client/components/text_badge/text_badge.js';
import './lyt_header_panel.html';

Template.lyt_header_panel.onCreated( function(){
    this.ronin = {
        spacerCount: 0
    };
});

Template.lyt_header_panel.helpers({
    // template helper
    //  only displayed in pageLayout
    displayBadge(){
        return Session.get( 'text_badge.text' );
    },
    hasMenuBar(){
        return g.run.width.get() > 750;
    },
    // menu_side is 150px width, should not use more than 20% of the viewport
    // so, minimal width to have always shown side menu is 750
    hasMenuButton(){
        return true; // window.width < 750;
    },
    // browser (with a title bar and an url) is assumed if not running Cordova
    hasTitle(){
        return true; //g.run.mobile;
    },
    // console helper - debug accounts-ui
    loginConsole(){
        //console.log( Accounts.ui );
    },
    // set a spacer between each element
    //  elements count is set on the instance itself
    preSpacer(){
        const spacerCount = Template.instance().ronin.spacerCount;
        let spacer = '';
        if( spacerCount > 0 ){
            spacer = '<span class="spacer"></span>';
        }
        Template.instance().ronin.spacerCount += 1;
        return spacer;
    },
    // make sure the first preSpacer is empty
    preSpacerInit(){
        Template.instance().ronin.spacerCount = 0;
    },
    // only change title on the page-based layout
    title(){
        let title = null;
        const last = g.run.resize.get();    // be reactive vs orientation change
        if( g.run.layout.get() === LYT_PAGE ){
            title = Session.get( 'header.title' );
        }
        if( !title ){
            const width = g.run.width.get();
            title = 'Ronin '+( width <= 480 ? 'rocks!' : 'takes care of your thoughts' );
        }
        return title;
    }
});
