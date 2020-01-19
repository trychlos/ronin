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
 *  Mobiles size:
 *  - Huawei Nova: 360x572 px
 *  - Sumsung S9:
 */
import '/imports/client/components/header_panel/header_panel.js';
import '/imports/client/components/mobile_body/mobile_body.js';
import '/imports/client/components/mobile_footer/mobile_footer.js';
import './touchable.html';

Template.appTouchable.onRendered( function(){
    let height = $(window).height();
    height -= $( '.lyt-header' ).height();
    height -= $( '.lyt-footer' ).height();
    $('.lyt-body').css({ 'max-height': height+'px' });
});
