/*
 * 'to_action' component.
 *  Transform a thought into an action.
 * 
 *  Parameters:
 *  - thought: a cursor with the one thought to be transformed.
 */
import { Actions } from '/imports/api/collections/actions/actions.js';
import { Thoughts } from '/imports/api/collections/thoughts/thoughts.js';
import '/imports/ui/components/action_status_select/action_status_select.js';
import '/imports/ui/components/contexts_select/contexts_select.js';
import '/imports/ui/components/date_select/date_select.js';
import '/imports/ui/components/projects_select/projects_select.js';
import '/imports/ui/components/topics_select/topics_select.js';
import './to_action.html';

Template.to_action.events({
    'click .js-transform'(event,instance){
        event.preventDefault();
        const prevNum = Session.get('process.thoughts.num');
        const prevCount = Template.process.fn.thoughtsCount();
        // build an object which embeds both the initial thought id
        //  and the to be created action
        // the server code will take care of transforming the former
        //  into the later
        Meteor.call('actions.fromThought', {
            thought: {
                id: instance.$('#to-action-thought-id').text()
            },
            action: {
                name: instance.$('.js-name').val(),
                topic: Template.topics_select.fn.getSelected( '.js-topic' ),
                context: Template.contexts_select.fn.getSelected( '.js-context' ),
                status: Template.action_status_select.fn.getSelected( '.js-status' ),
                outcome: instance.$('.js-outcome').val(),
                description: instance.$('.js-description').val(),
                start: Template.date_select.fn.getDate( '.js-datestart' ),
                due: Template.date_select.fn.getDate( '.js-datedue' ),
                done: Template.date_select.fn.getDate( '.js-datedone' ),
                project: Template.projects_select.fn.getSelected( '.js-project' )
            }
        }, ( error ) => {
            if( error ){
                return throwError({ message: error.message });
            }
        });
        // the client side reactive var may not be updated when calling
        //  the method - this is the reason why we provide a sure photo
        //  of the previous counters
        Template.process.fn.thoughtRemoved( prevNum, prevCount );
        return false;
    }
});
