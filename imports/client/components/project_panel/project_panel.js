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
    getContent: function( $dom ){
        let o =null;
        if( $dom ){
            o = {
                type: 'P',
                name: $( $dom.find( '.js-name' )[0] ).val(),
                topic: Template.topics_select.fn.getSelected( $dom ),
                purpose: $( $dom.find( '.js-purpose' )[0] ).val(),
                vision: $( $dom.find( '.js-vision' )[0] ).val(),
                description: $( $dom.find( '.js-description' )[0] ).val(),
                brainstorm: $( $dom.find( '.js-brainstorm' )[0] ).val(),
                parent: Template.projects_select.fn.getSelected( $dom ),
                future: $( $dom.find( '.js-future' )[0] ).prop( 'checked' ),
                startDate: Template.date_select.fn.getDate( $( $dom.find( '.js-datestart' )[0] )),
                dueDate: Template.date_select.fn.getDate( $( $dom.find( '.js-datedue' )[0] )),
                doneDate: Template.date_select.fn.getDate( $( $dom.find( '.js-datedone' )[0] )),
                notes: $( $dom.find( '.js-notes' )[0] ).val()
            };
        }
        return o;
    },
    initEditArea: function( $dom ){
        $( $dom.find( '.js-name' )[0] ).val('');
        Template.topics_select.fn.selectDefault( $dom );
        $( $dom.find( '.js-purpose' )[0] ).val('');
        $( $dom.find( '.js-vision' )[0] ).val('');
        $( $dom.find( '.js-description' )[0] ).val('');
        $( $dom.find( '.js-brainstorm' )[0] ).val('');
        Template.projects_select.fn.selectDefault( $dom );
        $( $dom.find( '.js-future' )[0] ).prop( 'checked', false ),
        Template.date_select.fn.clearDate( $( $dom.find( '.js-datestart' )[0] ));
        Template.date_select.fn.clearDate( $( $dom.find( '.js-datedue' )[0] ));
        Template.date_select.fn.clearDate( $( $dom.find( '.js-datedone' )[0] ));
        $( $dom.find( '.js-notes' )[0] ).val('');
    }
};

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
    valId(){
        return this.item ? this.item._id : '';
    },
    valName(){
        return this.item ? this.item.name : '';
    },
    valNotes(){
        return this.item ? this.item.notes : '';
    },
    valOwner(){
        const userId = this.item ? this.item.userId : null;
        let owner = '<unowned>';
        if( userId ){
            const user = Meteor.users.findOne({ _id: userId });
            if( user ){
                owner = user.emails[0].address;
            }
        }
        return owner;
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
