/*
 * 'to_action' component.
 *  Transform a thought into an action.
 *
 *  Parameters:
 *  - thought: the to-be-transformed thought.
 */
import '/imports/client/components/action_status_select/action_status_select.js';
import '/imports/client/components/contexts_select/contexts_select.js';
import '/imports/client/components/date_select/date_select.js';
import '/imports/client/components/projects_select/projects_select.js';
import '/imports/client/components/topics_select/topics_select.js';
import './to_action.html';

Template.to_action.onRendered( function(){
    this.autorun(() => {
        const status = Session.get( 'process.dbope' );
        switch( status ){
            // successful transformation operation, leave the page
            case DBOPE_LEAVE:
                Session.set( 'header.title', null );
                Session.set( 'collect.thought', null );
                FlowRouter.go( 'collect' );
                break;
            // all other cases, stay in the page
        }
        Session.set( 'process.dbope', null );
    });
});

Template.to_action.events({
    'click .js-transform'( ev, instance ){
        // form fields order
        const action = {
            name: instance.$('.js-name').val(),
            topic: Template.topics_select.fn.getSelected( '.js-topic' ),
            outcome: instance.$('.js-outcome').val(),
            context: Template.contexts_select.fn.getSelected( '.js-context' ),
            description: instance.$('.js-description').val(),
            project: Template.projects_select.fn.getSelected( '.js-project' ),
            status: Template.action_status_select.fn.getSelected( '.js-status' ),
            start: Template.date_select.fn.getDate( '.js-datestart' ),
            due: Template.date_select.fn.getDate( '.js-datedue' ),
            done: Template.date_select.fn.getDate( '.js-datedone' )
        };
        $( ev.target ).trigger( 'ronin.model.thought.action', action );
        return false;
    }
});
