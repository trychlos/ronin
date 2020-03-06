/*
 * 'action_button' template.
 *
 *  Transform a thought into an action.
 *
 *  Parameters:
 *  - item: the article to be transformed.
 */
import './action_button.html';

Template.action_button.events({
    'click .js-action'( event, instance ){
        g.run.back = FlowRouter.current().route.name;
        FlowRouter.go( 'rt.actions.thought', null, { id:instance.data.item._id });
        return false;
    }
});
