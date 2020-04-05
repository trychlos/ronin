/*
 * 'projects_footer' component.
 *
 *  Create a sticky footer in page layout.
 */
import '/imports/client/components/projects_tabs/projects_tabs.js';
import './projects_footer.html';

Template.projects_footer.helpers({
    // class helper: display only in development environment
    develClass(){
        return Meteor.isDevelopment ? '' : 'x-hidden';
    },
    // class helper: only display icons on small widths
    widthClass(){
        return Ronin.ui.runWidth() < 400 ? 'x-with-icon': 'x-with-label';
    }
});
