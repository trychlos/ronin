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
 *  Parameters:
 *  - item: the object to be edited, may be null.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import '/imports/client/components/date_select/date_select.js';
import '/imports/client/components/projects_select/projects_select.js';
import '/imports/client/components/topics_select/topics_select.js';
import './project_panel.html';

Template.project_panel.fn = {
    getContent: function(){
        const $this = $( '.project-panel' );
        const o = {
            type: 'P',
            name: $this.find('.js-name').val(),
            topic: Template.topics_select.fn.getSelected(),
            purpose: $this.find('.js-purpose').val(),
            vision: $this.find('.js-vision').val(),
            description: $this.find('.js-description').val(),
            brainstorm: $this.find('.js-brainstorm').val(),
            parent: Template.projects_select.fn.getSelected(),
            future: $this.find('.js-future').prop( 'checked' ),
            startDate: Template.date_select.fn.getDate( '.js-datestart' ),
            dueDate: Template.date_select.fn.getDate( '.js-datedue' ),
            doneDate: Template.date_select.fn.getDate( '.js-datedone' ),
            notes: $this.find('.js-notes').val()
        };
        //console.log( o );
        return o;
    },
    initEditArea: function(){
        $('.js-name').val('');
        Template.topics_select.fn.selectDefault();
        $('.js-purpose').val('');
        $('.js-vision').val('');
        $('.js-description').val('');
        $('.js-brainstorm').val('');
        Template.projects_select.fn.selectDefault();
        $('.js-future').prop( 'checked', false ),
        $('.js-datestart').val('');
        $('.js-datedue').val('');
        $('.js-datedone').val('');
        $('.js-notes').val('');
    }
};

Template.project_panel.onRendered( function(){
    const item = this.data.item;
    this.autorun(() => {
        const status = Session.get( 'project.dbope' );
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
                        $().IWindowed.close( '.project-panel' );
                        break;
                }
                break;
            // successful insert, reinit the page
            case DBOPE_REINIT:
                Template.project_panel.fn.initEditArea();
                break;
            // all other cases, stay in the page letting it unchanged
        }
        Session.set( 'project.dbope', null );
    });
});

Template.project_panel.helpers({
    valBrainstorm(){
        return this.item ? this.item.brainstorm : '';
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
    valFuture(){
        return this.item && this.item.future ? 'checked' : '';
    },
    valName(){
        return this.item ? this.item.name : '';
    },
    valNotes(){
        return this.item ? this.item.notes : '';
    },
    valParent(){
        return this.item ? this.item.parent : '';
    },
    valPurpose(){
        return this.item ? this.item.purpose : '';
    },
    valStartDate(){
        return this.item ? this.item.startDate : '';
    },
    valTopic(){
        return this.item ? this.item.topic : '';
    },
    valVision(){
        return this.item ? this.item.vision : '';
    }
});
