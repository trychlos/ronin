/*
 * 'projectsWindow' window.
 *  This is the main component for projects and actions reviewing.
 */
import '/imports/client/components/projects_tabs/projects_tabs.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './projects_window.html';

Template.projectsWindow.onRendered( function(){
    this.autorun(() => {
        if( g[LYT_DESKTOP].taskbar.get()){
            $('div.projects-window').IWindowed({
                template:   'projectsWindow',
                group:      'reviewWindow',
                title:      'Review, organize and do - Projects'
            });
        }
    });
});
