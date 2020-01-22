/*
 * 'collectPage' page.
 *
 *  - touchable device: display the collect page.
 *  - desktop device: runs and manages the non modal 'collectWindow' window.
 */
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import '/imports/client/windows/collect_window/collect_window.js';
import './collect_page.html';

Template.collectPage.onRendered( function(){
    this.autorun(() => {
        switch( g.run.layout.get()){
            case LYT_DESKTOP:
                if( g[LYT_DESKTOP].taskbar.get()){
                    $('.collect-page').IWindowed( 'show', 'collectWindow' );
                }
                break;
            case LYT_TOUCH:
                Blaze.render( Template.collectWindow, document.getElementsByClassName('collect-page')[0] );
                break;
        }
    })
});
