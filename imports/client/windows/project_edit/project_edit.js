/*
 * 'projectEdit' window.
 *
 *  This page lets the user edit a project.
 *
 *  Session variable:
 *  - review.project: the object to be edited, may be null.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> pageLayout { gtd, page, window }
 *              +-> reviewPage { gtd, window }
 *                      +-> projectsList { gtd }
 *                      |
 *                      +-> projectEdit { gtd }
 *                              +-> project_panel
 *                              +-> collapse_buttons
 */
import '/imports/client/components/collapse_buttons/collapse_buttons.js';
import '/imports/client/components/project_panel/project_panel.js';
import './project_edit.html';

Template.projectEdit.helpers({
    okLabel(){
        const label = Session.get( 'review.project' ) ? 'Update' : 'Create';
        return label;
    },
    title(){
        const title = Session.get( 'review.project' ) ? 'Edit project' : 'New project';
        Session.set( 'header.title', title );
        return title;
    }
});

Template.projectEdit.events({
    'click .js-cancel'( ev, instance ){
        Session.set( 'review.project', null );
        FlowRouter.go( 'review.projects' );
        return false;
    },
    'click .js-ok'( ev, instance ){
        const obj = Template.project_panel.fn.getContent();
        $( ev.target ).trigger( 'ronin.model.project.update', obj );
        return false;
    }
});
