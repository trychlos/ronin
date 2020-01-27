/*
 * 'pageLayout' layout.
 *  Main layout for page-based clients (mobiles and generally all touchable devices).
 *
 *  This is a fixed layout, with:
 *  - a fixed header,
 *  - a scrollable content,
 *  - a fixed footer.
 *
 *  IMPORTANT REMINDER:
 *      A touchable device may be small (e.g. a smartphone), or much bigger
 *      (e.g. a tablet or a tv). Page positionning must be made through media
 *      queries.
 */
import '/imports/client/components/header_panel/header_panel.js';
import '/imports/client/components/mobile_footer/mobile_footer.js';
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
    resized: function(){
        return 'resized helper run at '+g.run.resize.get();
    }
});
