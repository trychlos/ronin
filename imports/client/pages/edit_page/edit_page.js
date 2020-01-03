/*
 * 'editPage' page.
 *  Runs and manages the non modal 'editWindow' window.
 */
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import '/imports/client/windows/edit_window/edit_window.js';
import './edit_page.html';

Template.editPage.onRendered( function(){
    this.autorun(() => {
        if( g.taskbar.get()){
            $('.edit-page').IWindowed( 'showNew', 'editWindow' );
        }
    })
});
