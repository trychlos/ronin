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
 * - action: may be:
 *   > an activable Action object instance
 *   > a function which returns an activable Action object instance.
 */
import './project_button.html';

Template.project_button.onRendered( function(){
    this.autorun(() => {
        Ronin.enableActionButton( Template.currentData(), Template.instance().$( '.js-project' ));
    });
});

Template.project_button.events({
    'click .js-project'( event, instance ){
        return Ronin.activateActionButton( instance.data );
    }
});
