/*
 * 'appTouchable' layout.
 *  Main layout for touchable clients.
 *
 *  This is a fixed layout, with:
 *  - a fixed header,
 *  - a scrollable content,
 *  - a fixed footer.
 *
 *  See https://medium.com/@andrejsabrickis/a-fullscreen-modal-with-fixed-header-footer-and-a-scrollable-content-1656845c8171
 *
 *  IMPORTANT REMINDER:
 *      A touchable device may be small (e.g. a smartphone), or much bigger
 *      (e.g. a tablet or a tv). Page positionning must be made through media
 *      queries.
 *
 *  Mobiles size:
 *  - Huawei Nova: 360x572 px
 *  - Sumsung S9:
 */
import '/imports/client/components/header_panel/header_panel.js';
import '/imports/client/components/mobile_footer/mobile_footer.js';
import './touchable.html';

Template.appTouchable.onCreated( function(){
    window.addEventListener( 'resize', function(){
        g.run.resized.set( new Date());
    });
});

Template.appTouchable.onRendered( function(){
    this.autorun(() => {
        const a = g.run.resized.get();
        let height = $(window).height();
        height -= $( '.lyt-header' ).height();
        height -= $( '.lyt-footer' ).height();
        $('.lyt-body').css({ 'max-height': height+'px' });
    });
});

Template.appTouchable.helpers({
    resized: function(){
        return 'resized helper at '+g.run.resized.get();
    }
});
