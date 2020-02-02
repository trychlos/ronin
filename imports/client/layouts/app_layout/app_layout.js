/*
 * 'appLayout' layout.
 *
 *  This is the only layout template of the application.
 *  It dynamically adapts itself depending of the runtime detected configuration.
 *
 *  On a page-based (LYT_PAGE) layout:
 *  1. the 'ronin-page-layout' class is added to the topmost div
 *  2. this is a fixed layout, with:
 *      - lyt-header    a fixed sticky header,
 *      - lyt-content   a scrollable content,
 *      - lyt-footer    a fixed sticky footer.
 *
 *  On a window-based (LYT_WINDOW) layout:
 *
 *  Worflow:
 *  [routes.js]
 *      +-> appLayout { gtd, page, window }
 *
 *  The layout receives three parameters from the route manager.
 *  It consumes one of them to dynamically display the page template, and sends
 *  the two others as a data context to the page (here, to display the window).
 *
 *  Route-provided parameters:
 *  - 'gtd': the identifier of this features's group item
 *  - 'page': the name of the primary page
 *  - 'window': the window to be run by this 'page' page.
 *
 *  IMPORTANT REMINDER:
 *      A touchable device may be small (e.g. a smartphone), or much bigger
 *      (e.g. a tablet or a tv). Page positionning must be made through media
 *      queries.
 */
import '/imports/client/components/footer_panel/footer_panel.js';
import '/imports/client/components/header_panel/header_panel.js';
import '/imports/client/components/menu_side/menu_side.js';
import '/imports/client/components/message/message.js';
import '/imports/client/components/overview/overview.js';
import '/imports/client/pages/collect_page/collect_page.js';
import '/imports/client/pages/process_page/process_page.js';
import '/imports/client/pages/review_page/review_page.js';
import '/imports/client/pages/setup_page/setup_page.js';
import './app_layout.html';

Template.appLayout.onCreated( function(){
    window.addEventListener( 'resize', function(){
        g.run.resize.set( new Date());
    });
});

/*
Template.pageLayout.onRendered( function(){
    this.autorun(() => {
        const a = g.run.resize.get();
        //let height = $(window).height();
        let height = $( '.js-layout' ).innerHeight();
        height -= $( '.js-header' ).height();
        height -= $( '.js-footer' ).height();
        $('.lyt-body').css({ 'max-height': height+'px' });
    });
});
*/

Template.appLayout.onRendered( function(){
    this.autorun(() => {
        //console.log( 'appLayout:autorun layout='+g.run.layout.get());
        if( g.run.layout.get() === LYT_WINDOW ){
            if( !g[LYT_WINDOW].taskbar.get()){
                const taskbar = $('.lyt-taskbar').taskbar({
                    //buttonsTooltips: true,
                    localization: {
                        en: {
                            'group:collect': 'Collect',
                            'group:process': 'Process',
                            'group:review':  'Review',
                            'group:setup':   'Setup'
                        }
                    },
                    minimizeAll: false,
                    viewportMargins: {
                        top   : [ g[LYT_WINDOW].barTopHeight, "correctNone" ],
                        left  : [ g[LYT_WINDOW].barSideWidth, "correctNone" ]
                    },
                    windowButtonsSortable: false,
                    windowsContainment: 'visible',
                    debug: {
                        environment: true,
                        options: true,
                        localization: true
                    }
                });
                //console.log( 'desktop set taskbar' );
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
                //console.log( taskbar );
                g[LYT_WINDOW].taskbar.set( taskbar );
            }
        }
    })
});

Template.appLayout.helpers({
    // page may be empty (route is root)
    hasPage(){
        const data = Template.instance().data;
        return data && data.page;
    },
    // data context to be passed to the page
    //  just to be sure we are able to pass a complex data context
    pageContext(){
        return {
            gtd: Template.instance().data.gtd(),
            window: Template.instance().data.window()
        }
    },
    // page-base layout: just a place holder to be sure resizing is reactive
    pblResized(){
        return 'resized helper run at '+g.run.resize.get();
    },
    // window-based layout: the parent node of WM windows
    wblRootId(){
        return g[LYT_WINDOW].rootId;
    }
});
