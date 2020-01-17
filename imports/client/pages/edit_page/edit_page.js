/*
 * 'editPage' page.
 *  Runs and manages the non modal 'editWindow' window.
 *
 *  Session variables:
 *  - 'process.edit.obj': the object to be edited
 *     Makes this page reactive, rerunning it when the object changes.
 */
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import '/imports/client/windows/edit_window/edit_window.js';
import './edit_page.html';

Template.editPage.onRendered( function(){
    this.autorun(() => {
        if( g[LYT_DESKTOP].taskbar.get() && Session.get('process.edit.obj')){
            $('.edit-page').IWindowed( 'showNew', 'editWindow' );
        }
    })
});
