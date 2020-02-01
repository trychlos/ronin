/*
 * 'projectProcess' window.

 *  A window to transform a thought into a project.
 *
 *  Note that the 'project_panel' used component takes its data from the
 * 'review.project' session variable. We have so to copy the provided thought
 *  to this target variable.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> pageLayout { gtd, page, window }
 *              +-> processPage { gtd, window }
 *                      |
 *                      +-> projectProcess { gtd }
 *                              +-> project_panel
 *                              +-> collapsable_buttons
 *                      |
 *                      +-> actionProcess { gtd }
 *
 *  Session variables:
 *  - collect.thought: the to-be-transformed thought
 *  - review.project: the candidate project.
 */
import '/imports/client/components/project_panel/project_panel.js';
import '/imports/client/components/collapse_buttons/collapse_buttons.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './project_process.html';

Template.projectProcess.onRendered( function(){
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            this.$('div.edit-window').IWindowed({
                template:   'processProject',
                group:      'processWindow',
                title:      'Transform into a project'
            });
        }
    });
    this.autorun(() => {
        let project = Object.assign({}, Session.get( 'collect.thought' ));
        project.type = 'P';
        Session.set( 'review.project', project );
    });
});

Template.projectProcess.helpers({
    title(){
        const title = 'To a project';
        Session.set( 'header.title', title );
        return title;
    }
});

Template.projectProcess.events({
    'click .js-cancel'( ev, instance ){
        Session.set( 'header.title', null );
        Session.set( 'collect.thought', null );
        FlowRouter.go( 'collect' );
        return false;
    },
    'click .js-ok'( ev, instance ){
        const project = Template.project_panel.fn.getContent();
        $( ev.target ).trigger( 'ronin.model.thought.project', project );
        return false;
    }
});
