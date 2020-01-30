/*
 * 'pageLayout' layout.
 *  Main layout for page-based clients (mobiles and generally all touchable devices).
 *  This same layout is to be used for all features group.
 *
 *  This is a fixed layout, with:
 *  - a fixed header,
 *  - a scrollable content,
 *  - a fixed footer.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> pageLayout { group, page, window }
 *
 *  The layout receives three parameters from the route manager.
 *  It consumes one of them to dynamically display the page template, and sends
 *  the two others as a data context to this page (here, to display the window).
 *
 *  Route-provided parameters:
 *  - 'group': the identifier of this features's group
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
import '/imports/client/components/message/message.js';
import '/imports/client/pages/collect_page/collect_page.js';
import '/imports/client/pages/process_page/process_page.js';
import './page_layout.html';

Template.pageLayout.onCreated( function(){
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

Template.pageLayout.helpers({
    // data context to be passed to the page
    //  just to be sure we are able to pass a complex data context
    pageContext(){
        return {
            group: Template.instance().data.group,
            window: Template.instance().data.window
        }
    },
    // just a place holder to be sure resizing is reactive
    resized(){
        return 'resized helper run at '+g.run.resize.get();
    }
});