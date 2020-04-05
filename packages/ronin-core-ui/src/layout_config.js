/*
 * ronin-core-ui package - client-specific part.
 *
 * Apply to Ronin.ui.
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

if( Meteor.isClient ){

    import { ReactiveDict } from 'meteor/reactive-dict';
    import { ReactiveVar } from 'meteor/reactive-var';
    import { Session } from 'meteor/session';

    import detectIt from 'detect-it';

    // exported global constants
    LYT_PAGE = 'pageLayout';
    LYT_WINDOW = 'windowLayout';

    // update the Ronin global
    Ronin.ui = {

        // user interface default values
        defaults: {
            'page.group': 'gtd-collect-thoughts-list'
        },

        // available (and managed) layouts
        layouts: {

            // pageLayout constants and defaults
            // page-based layout, for a touchable device (a browser without mouse, or Cordova)
            //  size from smartphone to the TV
            pageLayout: {
            },

            // windowLayout constants and defaults
            // window-based (aka desktop) layout
            //  requires a mouse as it makes use of Simone window manager
            windowLayout: {
                barSideWidth: 150,
                barTopHeight:  30,
                rootId:      '25d211fe-06ba-4781-ae41-c5a20e66075d',
                taskbar:      new ReactiveVar( null )
            }
        },

        // the result of the detectIt module
        //  https://www.npmjs.com/package/detect-it
        detectIt: detectIt,

        // runtime reactive datas which describe the running context
        //  automatically initialized from runtime detection
        //  overridable by the user (mostly for development purpose).
        runContext: new ReactiveDict(),

        // getters / setters
        runBack( route ){
            if( route ){
                Ronin.ui.runContext.set( 'back', route );
                return route;
            }
            return Ronin.ui.runContext.get( 'back' );
        },
        runHeight( height ){
            if( height ){
                Ronin.ui.runContext.set( 'height', height );
                return height;
            }
            return Ronin.ui.runContext.get( 'height' );
        },
        runLayout( layout ){
            if( layout ){
                Ronin.ui.runContext.set( 'layout', layout );
                return layout;
            }
            return Ronin.ui.runContext.get( 'layout' );
        },
        runResize( stamp ){
            if( stamp ){
                Ronin.ui.runContext.set( 'resize', stamp );
                return stamp;
            }
            return Ronin.ui.runContext.get( 'resize' );
        },
        runWidth( width ){
            if( width ){
                Ronin.ui.runContext.set( 'width', width );
                return width;
            }
            return Ronin.ui.runContext.get( 'width' );
        }
    };

    Ronin.ui.runContext.set( 'back', null );
    Ronin.ui.runContext.set( 'height', $( window ).height());
    Ronin.ui.runContext.set( 'layout', detectIt.primaryInput === 'mouse' ? LYT_WINDOW : LYT_PAGE);
    Ronin.ui.runContext.set( 'mobile', Meteor.isCordova );
    Ronin.ui.runContext.set( 'resize', null );
    Ronin.ui.runContext.set( 'width', $( window ).width());

    // set a default route for the page-based layouts
    const page = Session.get( 'page.group' );
    if( !page || !page.startsWith( 'gtd-' )){
        Session.set( 'page.group', Ronin.ui.defaults['page.group'] );
    }
}
