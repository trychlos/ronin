/*
 * 'appLayout' layout.
 *
 *  This is the only layout template of the application.
 *  It dynamically adapts itself depending of the runtime detected configuration.
 *
 *  On a page-based (R_LYT_PAGE) layout:
 *  1. the 'ronin-lyt-page' class is added to the topmost div
 *  2. this is a fixed layout, with:
 *      - lyt-header    a fixed sticky header,
 *      - lyt-content   a scrollable content,
 *      - lyt-footer    a fixed sticky footer.
 *
 *  On a window-based (R_LYT_WINDOW) layout:
 *  1. the 'ronin-lyt-window' class is added to the topmost div
 *  2. this is a fixed layout, with detached windows:
 *      - lyt-header    the same fixed sticky header than in R_LYT_PAGE layout,
 *      - lyt-content   a full page, not designed for scroll, content,
 *                      which contains 'side' and 'overview' navigation panels
 *  3. in this layout, each page is opened in its own detached 'window'.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> appLayout { gtdid, group, template }
 *
 *  IMPORTANT REMINDERS:
 *   1 - A touchable device may be small (e.g. a smartphone), or much bigger
 *       (e.g. a tablet or a tv). Page positionning must be made through media
 *       queries.
 *   2 - Helpers are called in the passed-in data context.
 *
 *  Session variables:
 *  - 'layout.context': this is a copy of the data context passed in from routes.js
 *      It let our layers (app, group, window) be reactive against route changes.
 *      Caution: must only be used at rendering time, as it will be superseded
 *      by later changes.
 */
import '/imports/client/business/articles_model.js';
import '/imports/client/business/actions_model.js';
import '/imports/client/business/contexts_model.js';
import '/imports/client/business/delegates_model.js';
import '/imports/client/business/energy_values_model.js';
import '/imports/client/business/priority_values_model.js';
import '/imports/client/business/projects_model.js';
import '/imports/client/business/thoughts_model.js';
import '/imports/client/business/time_values_model.js';
import '/imports/client/business/topics_model.js';

import '/imports/client/components/footer_nav/footer_nav.js';
import '/imports/client/components/header_nav/header_nav.js';
import '/imports/client/components/menu_side/menu_side.js';
import '/imports/client/components/message/message.js';
import '/imports/client/components/overview/overview.js';

import '/imports/client/groups/collect_group/collect_group.js';
import '/imports/client/groups/process_group/process_group.js';
import '/imports/client/groups/review_group/review_group.js';
import '/imports/client/groups/setup_group/setup_group.js';

import './app_layout.html';

Template.appLayout.fn = {
    eval_rec( o ){
        let res = {};
        for( var key in o ){
            if( o.hasOwnProperty( key )){
                if( typeof o[key] === 'function' ){
                    res[key] = o[key]();
                } else if( typeof o[key] === 'object' ){
                    res[key] = Template.appLayout.fn.eval_rec( o[key] );
                } else {
                    res[key] = o[key];
                }
            }
        }
        return res;
    }
};

Template.appLayout.onRendered( function(){
    //console.log( 'appLayout.onRendered' );
    this.autorun(() => {
        if( Ronin.ui.runLayout() === R_LYT_WINDOW ){
            if( !Ronin.ui.layouts[R_LYT_WINDOW].taskbar.get()){
                const taskbar = $('.lyt-taskbar').taskbar({
                    //buttonsTooltips: true,
                    localization: {
                        en: {
                            'group:collectGroup': 'Collect',
                            'group:processGroup': 'Process',
                            'group:reviewGroup':  'Review',
                            'group:setupGroup':   'Setup'
                        }
                    },
                    viewportMargins: {
                        top   : [ Ronin.ui.layouts[R_LYT_WINDOW].barTopHeight, "correctNone" ],
                        left  : [ Ronin.ui.layouts[R_LYT_WINDOW].barSideWidth, "correctNone" ]
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
                        FlowRouter.go( 'rt.home' );
                    }
                });
                //console.log( taskbar );
                Ronin.ui.layouts[R_LYT_WINDOW].taskbar.set( taskbar );
            }
        }
    });
});

Template.appLayout.helpers({
    // in windowLayout, template may be undefined if route is /
    // in pageLayout, there is always one (computed from page.group)
    hasTemplate(){
        let data = Template.instance().data;
        return data.template;
    },
    // data context to be passed to the other layers
    //  note that this data context would not be reactive without the session variable.
    layoutContext(){
        const context = Template.appLayout.fn.eval_rec( this );
        Session.set( 'layout.context', context );
        //console.log( 'appLayout:layoutContext :' );
        //console.log( context );
        return context;
    },
    // template helper
    //  returns the GDT features group template name,
    groupTemplate(){
        const context = Template.appLayout.fn.eval_rec( this );
        return context.group;
    },
    // page-base layout: just a place holder to be sure resizing is reactive
    pblResized(){
        return 'resized helper run at '+Ronin.ui.runResize();
    },
    // window-based layout: the parent node of WM windows
    wblRootId(){
        return Ronin.ui.layouts[R_LYT_WINDOW].rootId;
    }
});

Template.appLayout.onDestroyed( function(){
    //console.log( 'appLayout.onDestroyed' );
});
