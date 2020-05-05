/*
 * 'action_panel' component.
 *
 *  Let the user edit an action:
 *  - transform a thought into an action
 *  - create a new action
 *  - edit an existing action.
 *
 *  Parameters:
 *  - item: the item to be edited, may be null.
 */
import '/imports/client/components/action_status_select/action_status_select.js';
import '/imports/client/components/contexts_select/contexts_select.js';
import '/imports/client/components/date_select/date_select.js';
import '/imports/client/components/projects_select/projects_select.js';
import '/imports/client/components/topics_select/topics_select.js';
import './action_panel.html';

Template.action_panel.fn = {
    getContent: function( $dom ){
        let o = null;
        if( $dom ){
            o = {
                type: R_OBJ_ACTION,
                name: $( $dom.find( '.js-name' )[0] ).val(),
                topic: Template.topics_select.fn.getSelected( $dom ),
                outcome: $( $dom.find( '.js-outcome' )[0] ).val(),
                context: Template.contexts_select.fn.getSelected( $dom ),
                description: $( $dom.find( '.js-description' )[0] ).val(),
                parent: Template.projects_select.fn.getSelected( $dom ),
                status: Template.action_status_select.fn.getSelected( $dom ),
                startDate: Template.date_select.fn.getDate( $( $dom.find( '.js-datestart' )[0] )),
                dueDate: Template.date_select.fn.getDate( $( $dom.find( '.js-datedue' )[0] )),
                doneDate: Template.date_select.fn.getDate( $( $dom.find( '.js-datedone' )[0] )),
                notes: $( $dom.find( '.js-notes' )[0] ).val()
            };
        }
        return o;
    },
    initEditArea: function( $dom ){
        if( $dom ){
            $( $dom.find('.js-name')[0] ).val('');
            Template.topics_select.fn.selectDefault( $dom );
            $( $dom.find( '.js-outcome' )[0] ).val('');
            Template.contexts_select.fn.selectDefault( $dom );
            $( $dom.find( '.js-description' )[0] ).val('');
            Template.projects_select.fn.selectDefault( $dom );
            Template.action_status_select.fn.selectDefault( $dom );
            Template.date_select.fn.clearDate( $( $dom.find( '.js-datestart' )[0] ));
            Template.date_select.fn.clearDate( $( $dom.find( '.js-datedue' )[0] ));
            Template.date_select.fn.clearDate( $( $dom.find( '.js-datedone' )[0] ));
            $( $dom.find( '.js-notes' )[0] ).val('');
        }
    }
};

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
    valId(){
        return this.item ? this.item._id : '';
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
