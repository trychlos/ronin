/*
 * 'project_panel' component.
 *
 *  Let the user edit a project:
 *  - transform a thought into a project
 *  - create a new project
 *  - edit an existing project.
 *
 *  Parameters:
 *  - route: the route to go back when leaving the panel
 *      Rationale: this panel is used to:
 *      > create/edit projects -> back to projectsList which is the default
 *      > transform a thought into a project -> back to thoughtsList.
 *
 *  Session variables:
 *  - review.project: the to-be-edited project.
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
            topic: Template.topics_select.fn.getSelected(),
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
    },
    initEditArea: function(){
        const instance = Template.instance();
        if( instance.view.isRendered ){
            instance.$('.js-name').val('');
            Template.topics_select.fn.selectDefault();
            instance.$('.js-purpose').val('');
            instance.$('.js-vision').val('');
            instance.$('.js-description').val('');
            instance.$('.js-brainstorm').val('');
            Template.projects_select.fn.unselect();
            instance.$('.js-future').prop( 'checked', false ),
            instance.$('.js-datestart').val('');
            instance.$('.js-datedue').val('');
            instance.$('.js-datedone').val('');
            instance.$('.js-notes').val('');
        }
    }
};

Template.project_panel.onRendered( function(){
    this.autorun(() => {
        const status = Session.get( 'review.dbope' );
        switch( status ){
            // successful update operation, leave the page
            case DBOPE_LEAVE:
                Session.set( 'review.project', null );
                const route = this.data.route || 'review.projects';
                FlowRouter.go( route );
                break;
            // successful insert operation, stay in the page, reinitializing it
            case DBOPE_REINIT:
                Template.project_panel.fn.initEditArea();
                Session.set( 'review.project', null );
                break;
            // all other cases, stay in the page, letting it unchanged
        }
        Session.set( 'review.dbope', null );
    });
});

Template.project_panel.helpers({
    valBrainstorm(){
        const project = Session.get( 'review.project' );
        return project ? project.brainstorm : '';
    },
    valDescription(){
        const project = Session.get( 'review.project' );
        return project ? project.description : '';
    },
    valDoneDate(){
        const project = Session.get( 'review.project' );
        return project ? project.doneDate : '';
    },
    valDueDate(){
        const project = Session.get( 'review.project' );
        return project ? project.dueDate : '';
    },
    valFuture(){
        const project = Session.get( 'review.project' );
        return project && project.future ? 'checked' : '';
    },
    valName(){
        const project = Session.get( 'review.project' );
        return project ? project.name : '';
    },
    valNotes(){
        const project = Session.get( 'review.project' );
        return project ? project.notes : '';
    },
    valParent(){
        const project = Session.get( 'review.project' );
        return project ? project.parent : '';
    },
    valPurpose(){
        const project = Session.get( 'review.project' );
        return project ? project.purpose : '';
    },
    valStartDate(){
        const project = Session.get( 'review.project' );
        return project ? project.startDate : '';
    },
    valTopic(){
        const project = Session.get( 'review.project' );
        return project ? project.topic : '';
    },
    valVision(){
        const project = Session.get( 'review.project' );
        return project ? project.vision : '';
    }
});
