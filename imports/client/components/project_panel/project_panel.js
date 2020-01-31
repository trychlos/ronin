/*
 * 'project_panel' component.
 *
 *  Let the user edit a project:
 *  - transform a thought into a project
 *  - create a new project
 *  - edit an existing project.
 *
 *  Parameters:
 *  - project: the to-be-edited project.
 */
import '/imports/client/components/date_select/date_select.js';
import '/imports/client/components/projects_select/projects_select.js';
import '/imports/client/components/topics_select/topics_select.js';
import './project_panel.html';

Template.project_panel.fn = {
    getContent: function(){
        const instance = Template.instance();
        return {
            type: 'P',
            name: instance.$('.js-name').val(),
            topic: Template.topics_select.fn.getSelected( '.js-topic' ),
            purpose: instance.$('.js-purpose').val(),
            vision: instance.$('.js-vision').val(),
            description: instance.$('.js-description').val(),
            brainstorm: instance.$('.js-brainstorm').val(),
            parent: Template.projects_select.fn.getSelected( '.js-project' ),
            future: instance.$('.js-future').prop( 'checked' ),
            startDate: Template.date_select.fn.getDate( '.js-datestart' ),
            dueDate: Template.date_select.fn.getDate( '.js-datedue' ),
            doneDate: Template.date_select.fn.getDate( '.js-datedone' ),
            notes: instance.$('.js-notes').val()
        };
    }
};

Template.project_panel.onRendered( function(){
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

Template.project_panel.helpers({
    isFuture( future ){
        return future ? 'checked' : '';
    }
});
