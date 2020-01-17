/*
 * 'appTouchable' layout.
 *  Main layout for touchable clients.
 */
import '/imports/client/components/mobile_body/mobile_body.js';
import '/imports/client/components/mobile_footer/mobile_footer.js';
import '/imports/client/components/mobile_header/mobile_header.js';
import './touchable.html';

Template.appTouchable.onRendered( function(){
    let rem = $('body').css('font-size');   // 16px
    let height = $(window).height();        // 790
    height -= 6 * parseInt( rem );
    $('.lyt-body').css({ 'max-height': height+'px' });
    //console.log( 'settings lyt-body.max-height='+height+'px' );
});
