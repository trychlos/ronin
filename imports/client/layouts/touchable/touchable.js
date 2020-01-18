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
 *  Mobile sizes:
 *  - Huawei Nova: 360x572 px
 *  - Sumsung S9:
 */
import '/imports/client/components/mobile_body/mobile_body.js';
import '/imports/client/components/mobile_footer/mobile_footer.js';
import '/imports/client/components/mobile_header/mobile_header.js';
import './touchable.html';

Template.appTouchable.onRendered( function(){
    //let rem = $('body').css('font-size');   // 16px
    let height = $(window).height();        // 790
    //height -= 6 * parseInt( rem );
    height -= $( '.lyt-header' ).height();
    height -= $( '.lyt-footer' ).height();
    $('.lyt-body').css({ 'max-height': height+'px' });
    //console.log( 'settings lyt-body.max-height='+height+'px' );
});
