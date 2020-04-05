/*
 * 'project_button' template.
 *
 *  Transform a thought (resp. an action) into a project.
 *
 *  When transforming an action into a project:
 *  - status, context, outcome are copied into notes
 *  - last_status is forgiven
 *
 *  Parameters:
 *  - item: the article to be transformed.
 */
import './project_button.html';

Template.project_button.events({
    'click .js-project'( event, instance ){
        Ronin.ui.runBack( FlowRouter.current().route.name );
        FlowRouter.go( 'rt.projects.thought', null, { id:instance.data.item._id });
        return false;
    }
});
