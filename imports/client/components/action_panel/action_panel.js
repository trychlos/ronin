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
 *  Parameters:
 *  - item: the object to be edited, may be null.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import '/imports/client/components/action_status_select/action_status_select.js';
import '/imports/client/components/contexts_select/contexts_select.js';
import '/imports/client/components/date_select/date_select.js';
import '/imports/client/components/projects_select/projects_select.js';
import '/imports/client/components/topics_select/topics_select.js';
import './action_panel.html';

Template.action_panel.fn = {
    getContent: function(){
        return {
            type: 'A',
            name: $('.js-name').val(),
            topic: Template.topics_select.fn.getSelected(),
            outcome: $('.js-outcome').val(),
            context: Template.contexts_select.fn.getSelected(),
            description: $('.js-description').val(),
            parent: Template.projects_select.fn.getSelected(),
            status: Template.action_status_select.fn.getSelected(),
            startDate: Template.date_select.fn.getDate( '.js-datestart' ),
            dueDate: Template.date_select.fn.getDate( '.js-datedue' ),
            doneDate: Template.date_select.fn.getDate( '.js-datedone' ),
            notes: $('.js-notes').val()
        };
    },
    initEditArea: function(){
        $('.js-name').val('');
        Template.topics_select.fn.selectDefault();
        $('.js-outcome').val('');
        Template.contexts_select.fn.selectDefault();
        $('.js-description').val('');
        Template.projects_select.fn.unselect();
        Template.action_status_select.fn.selectDefault();
        $('.js-datestart').val('');
        $('.js-datedue').val('');
        $('.js-datedone').val('');
        $('.js-notes').val('');
    }
};

Template.action_panel.onRendered( function(){
    const item = this.data.item;
    this.autorun(() => {
        const status = Session.get( 'action.dbope' );
        switch( status ){
            // successful update, leave the page
            case DBOPE_LEAVE:
                if( item ){
                    $.pubsub.publish( 'ronin.model.reset', item._id );
                }
                switch( g.run.layout.get()){
                    case LYT_PAGE:
                        FlowRouter.go( g.run.back );
                        break;
                    case LYT_WINDOW:
                        $().IWindowed.close( '.action-panel' );
                        break;
                }
                break;
            // successful insert, reinit the page
            case DBOPE_REINIT:
                Template.action_panel.fn.initEditArea();
                break;
            // all other cases, stay in the page letting it unchanged
        }
        Session.set( 'action.dbope', null );
    });
});

Template.action_panel.helpers({
    valContext(){
        return this.item ? this.item.context : '';
    },
    valDescription(){
        return this.item ? this.item.description : '';
    },
    valDoneDate(){
        return this.item ? this.item.doneDate : '';
    },
    valDueDate(){
        return this.item ? this.item.dueDate : '';
    },
    valName(){
        return this.item ? this.item.name : '';
    },
    valNotes(){
        return this.item ? this.item.notes : '';
    },
    valOutcome(){
        return this.item ? this.item.outcome : '';
    },
    valParent(){
        return this.item ? this.item.parent : '';
    },
    valStartDate(){
        return this.item ? this.item.startDate : '';
    },
    valStatus(){
        return this.item ? this.item.status : '';
    },
    valTopic(){
        return this.item ? this.item.topic : '';
    }
});
