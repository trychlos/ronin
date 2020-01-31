/*
 * 'to_project' component.
 *  Create a project from a thought.
 *
 *  Parameters:
 *  - thought: the to-be-transformed thought.
 */
import '/imports/client/components/date_select/date_select.js';
import '/imports/client/components/topics_select/topics_select.js';
import './to_project.html';

Template.to_project.onRendered( function(){
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

Template.to_project.events({
    'click .js-transform'( ev, instance ){
        // form fields order
        const project = {
            name: instance.$('.js-name').val(),
            topic: Template.topics_select.fn.getSelected( '.js-topic' ),
            purpose: instance.$('.js-purpose').val(),
            vision: instance.$('.js-vision').val(),
            description: instance.$('.js-description').val(),
            brainstorm: instance.$('.js-brainstorm').val(),
            future: instance.$('.js-future').is(':checked'),
            start: Template.date_select.fn.getDate( '.js-datestart' ),
            due: Template.date_select.fn.getDate( '.js-datedue' ),
            done: Template.date_select.fn.getDate( '.js-datedone' )
        };
        $( ev.target ).trigger( 'ronin.model.thought.project', project );
        return false;
    }
});
