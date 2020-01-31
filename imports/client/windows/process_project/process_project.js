/*
 * 'processProject' window.

 *  A window to transform a thought into a project.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> pageLayout { gtd, page, window }
 *              +-> processPage { gtd, window }
 *                      |
 *                      +-> processProject { gtd }
 *                              +-> project_panel
 *                              +-> collapsable_buttons
 *                      |
 *                      +-> processAction { gtd }
 *
 *  Session variables:
 *  - collect.thought: the to-be-transformed thought.
 */
import '/imports/client/components/project_panel/project_panel.js';
import '/imports/client/components/collapse_buttons/collapse_buttons.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './process_project.html';

Template.processProject.onRendered( function(){
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            this.$('div.edit-window').IWindowed({
                template:   'processProject',
                group:      'processWindow',
                title:      'Transform into a project'
            });
        }
    });
});

Template.processProject.helpers({
    toProject(){
        let project = Object.assign({}, Session.get( 'collect.thought' ));
        project.type = 'P';
        return project;
    },
    title(){
        const title = 'To a project';
        Session.set( 'header.title', title );
        return title;
    }
});

Template.processProject.events({
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
