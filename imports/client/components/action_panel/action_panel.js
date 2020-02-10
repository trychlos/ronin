/*
 * 'action_panel' component.
 *
 *  Let the user edit an action:
 *  - transform a thought into an action
 *  - create a new action
 *  - edit an existing action.
 *
 *  Parameters:
 *  - route: the route to go back when leaving the panel
 *      Rationale: this panel is used to:
 *      > create/edit actions -> back to actionsList which is the default
 *      > transform a thought into an action -> back to thoughtsList.
 *
 *  Session variable:
 *  - review.action: the object to be edited, may be null.
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
            topic: Template.topics_select.fn.getSelected( instance ),
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
    },
    initEditArea: function(){
        const instance = Template.instance();
        if( instance.view.isRendered ){
            instance.$('.js-name').val('');
            Template.topics_select.fn.selectDefault();
            instance.$('.js-outcome').val('');
            Template.contexts_select.fn.selectDefault();
            instance.$('.js-description').val('');
            Template.projects_select.fn.unselect();
            Template.action_status_select.fn.selectDefault();
            instance.$('.js-datestart').val('');
            instance.$('.js-datedue').val('');
            instance.$('.js-datedone').val('');
            instance.$('.js-notes').val('');
        }
    }
};

Template.action_panel.onRendered( function(){
    this.autorun(() => {
        const status = Session.get( 'review.dbope' );
        switch( status ){
            // successful update, leave the page
            case DBOPE_LEAVE:
                Session.set( 'review.action', null );
                const route = this.data.route || 'review.actions';
                FlowRouter.go( route );
                break;
            // successful insert, reinit the page
            case DBOPE_REINIT:
                Session.set( 'review.action', null );
                Template.action_panel.fn.initEditArea();
                break;
            // all other cases, stay in the page letting it unchanged
        }
        Session.set( 'review.dbope', null );
    });
});

Template.action_panel.helpers({
    valContext(){
        const action = Session.get( 'review.action' );
        return action ? action.context : '';
    },
    valDescription(){
        const action = Session.get( 'review.action' );
        return action ? action.description : '';
    },
    valDoneDate(){
        const action = Session.get( 'review.action' );
        return action ? action.doneDate : '';
    },
    valDueDate(){
        const action = Session.get( 'review.action' );
        return action ? action.dueDate : '';
    },
    valName(){
        const action = Session.get( 'review.action' );
        return action ? action.name : '';
    },
    valNotes(){
        const action = Session.get( 'review.action' );
        return action ? action.notes : '';
    },
    valOutcome(){
        const action = Session.get( 'review.action' );
        return action ? action.outcome : '';
    },
    valParent(){
        const action = Session.get( 'review.action' );
        return action ? action.parent : '';
    },
    valStartDate(){
        const action = Session.get( 'review.action' );
        return action ? action.startDate : '';
    },
    valStatus(){
        const action = Session.get( 'review.action' );
        return action ? action.status : '';
    },
    valTopic(){
        const action = Session.get( 'review.action' );
        return action ? action.topic : '';
    }
});
