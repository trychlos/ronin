/*
 * 'to_project' component.
 *  Create a project from a thought.
 * 
 *  Parameters:
 *  - thought: a cursor with only one element.
 */
import { Projects } from '/imports/api/collections/projects/projects.js';
import { Thoughts } from '/imports/api/collections/thoughts/thoughts.js';
import '/imports/ui/components/date_select/date_select.js';
import '/imports/ui/components/topics_select/topics_select.js';
import './to_project.html';

Template.to_project.events({
    'click .js-transform'(event, instance){
        event.preventDefault();
        const prevNum = Session.get('process.thoughts.num');
        const prevCount = Template.process.fn.thoughtsCount();
        // build an object which embeds both the initial thought id
        //  and the to be created project
        // the server code will take care of transforming the former
        //  into the later
        Meteor.call('projects.fromThought', {
            thought: {
                id: instance.$('#to-project-thought-id').text()
            },
            project: {
                name: instance.$('.js-name').val(),
                topic: Template.topics_select.fn.getSelected( '.js-topic' ),
                purpose: instance.$('.js-purpose').val(),
                vision: instance.$('.js-vision').val(),
                brainstorm: instance.$('.js-brainstorm').val(),
                description: instance.$('.js-description').val(),
                start: Template.date_select.fn.getDate( '.js-datestart' ),
                due: Template.date_select.fn.getDate( '.js-datedue' ),
                done: Template.date_select.fn.getDate( '.js-datedone' ),
                future: instance.$('.js-future').is(':checked')
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
