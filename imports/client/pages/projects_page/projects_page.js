/*
 * 'projectsPage' page.
 *  Runs and manages the non modal 'projectsWindow' window.
 */
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import '/imports/client/windows/projects_window/projects_window.js';
import './projects_page.html';

Template.projectsPage.onRendered( function(){
    this.autorun(() => {
        if( g.taskbar.get()){
            $('.projects-page').IWindowed( 'show', 'projectsWindow' );
        }
    })
});
