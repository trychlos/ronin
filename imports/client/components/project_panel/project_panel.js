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
        return {
            type: 'P',
            name: $('.js-name').val(),
            topic: Template.topics_select.fn.getSelected(),
            purpose: $('.js-purpose').val(),
            vision: $('.js-vision').val(),
            description: $('.js-description').val(),
            brainstorm: $('.js-brainstorm').val(),
            parent: Template.projects_select.fn.getSelected(),
            future: $('.js-future').prop( 'checked' ),
            startDate: Template.date_select.fn.getDate( '.js-datestart' ),
            dueDate: Template.date_select.fn.getDate( '.js-datedue' ),
            doneDate: Template.date_select.fn.getDate( '.js-datedone' ),
            notes: $('.js-notes').val()
        };
    },
    initEditArea: function(){
        $('.js-name').val('');
        Template.topics_select.fn.selectDefault();
        $('.js-purpose').val('');
        $('.js-vision').val('');
        $('.js-description').val('');
        $('.js-brainstorm').val('');
        Template.projects_select.fn.unselect();
        $('.js-future').prop( 'checked', false ),
        $('.js-datestart').val('');
        $('.js-datedue').val('');
        $('.js-datedone').val('');
        $('.js-notes').val('');
    }
};

Template.project_panel.onRendered( function(){
    this.autorun(() => {
        const status = Session.get( 'project.dbope' );
        switch( status ){
            // successful update, leave the page
            case DBOPE_LEAVE:
                const project = Session.get( 'review.project' );
                if( project ){
                    $.pubsub.publish( 'ronin.model.reset', project._id );
                }
                switch( g.run.layout.get()){
                    case LYT_PAGE:
                        FlowRouter.go( g.run.back );
                        break;
                    case LYT_WINDOW:
                        $().IWindowed.close( '.project-panel' );
                        break;
                }
                break;
            // successful insert, reinit the page
            case DBOPE_REINIT:
                Session.set( 'review.project', null );
                Template.project_panel.fn.initEditArea();
                break;
            // all other cases, stay in the page letting it unchanged
        }
        Session.set( 'project.dbope', null );
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
