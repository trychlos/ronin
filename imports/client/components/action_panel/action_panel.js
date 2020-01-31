/*
 * 'action_panel' component.
 *
 *  Let the user edit an action:
 *  - transform a thought into an action
 *  - create a new action
 *  - edit an existing action.
 *
 *  Parameters:
 *  - action: the to-be-edited action.
 */
import '/imports/client/components/action_status_select/action_status_select.js';
import '/imports/client/components/contexts_select/contexts_select.js';
import '/imports/client/components/date_select/date_select.js';
import '/imports/client/components/projects_select/projects_select.js';
import '/imports/client/components/topics_select/topics_select.js';
import './action_panel.html';

Template.action_panel.fn = {
    getContent: function(){
        const instance = Template.instance();
        return {
            type: 'A',
            name: instance.$('.js-name').val(),
            topic: Template.topics_select.fn.getSelected( '.js-topic' ),
            outcome: instance.$('.js-outcome').val(),
            context: Template.contexts_select.fn.getSelected( '.js-context' ),
            description: instance.$('.js-description').val(),
            parent: Template.projects_select.fn.getSelected( '.js-project' ),
            status: Template.action_status_select.fn.getSelected( '.js-status' ),
            startDate: Template.date_select.fn.getDate( '.js-datestart' ),
            dueDate: Template.date_select.fn.getDate( '.js-datedue' ),
            doneDate: Template.date_select.fn.getDate( '.js-datedone' ),
            notes: instance.$('.js-notes').val()
        };
    }
};

Template.action_panel.onRendered( function(){
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
