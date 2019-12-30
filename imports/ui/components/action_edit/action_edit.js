/*
 * 'action_edit' component.
 *  Let the user edit an action.
 */
import { Meteor } from 'meteor/meteor';
import { Actions } from '/imports/api/collections/actions/actions.js';
import '/imports/ui/components/contexts_select/contexts_select.js';
import '/imports/ui/components/date_select/date_select.js';
import '/imports/ui/components/projects_select/projects_select.js';
import '/imports/ui/components/topics_select/topics_select.js';
import './action_edit.html';

Template.action_edit.fn = {
    focus: function( selector ){
        const instance = Template.instance();
        if( instance.view.isRendered ){
            $elt = instance.$(selector);
            if( $elt ){
                $elt.focus().select();
            }
        }
    }
};

Template.action_edit.onRendered( function(){
});
  
Template.action_edit.helpers({
    button(){
        const obj = Session.get('review.projects.obj');
        let label = 'Update';
        if( !obj || !obj._id ){
            label = 'Insert';
        }
        return label;
    },
    it(){
        Template.action_edit.fn.focus('.js-name');
        return Session.get('review.projects.obj');
    }
});

Template.action_edit.events({
    'click .js-update'( event, instance ){
        event.preventDefault();
        // a name is mandatory
        const name = instance.$('.js-name').val();
        if( name.length ){
            const obj = Session.get( 'review.projects.obj' );
            const id = obj ? obj._id : null;
            var newobj = {
                name: name,
                topic: Template.topics_select.fn.getSelected( '.js-topic' ),
                status: Template.action_status_select.fn.getSelected( '.js-status' ),
                context: Template.contexts_select.fn.getSelected( '.js-context' ),
                outcome: instance.$('.js-outcome').val(),
                description: instance.$('.js-description').val(),
                project: Template.projects_select.fn.getSelected( '.js-project' ),
                startDate: Template.date_select.fn.getDate( '.js-datestart' ),
                dueDate: Template.date_select.fn.getDate( '.js-datedue' ),
                doneDate: Template.date_select.fn.getDate( '.js-datedone' ),
                notes: instance.$('.js-notes').val(),
            };
            if( id ){
                Meteor.call('actions.update', id, newobj, ( error ) => {
                    if( error ){
                        return throwError({ message: error.message });
                    }
                });
                newobj._id = id;
                // if project has changed, then the previous tree should be updated (refreshed)
                if( obj.project !== newobj.project ){
                    Template.projects_tree.fn.updateTree( obj );
                }
            } else {
                newobj._id = Meteor.call('actions.insert', newobj, ( error ) => {
                    if( error ){
                        return throwError({ message: error.message });
                    }
                });
            }
            Session.set( 'review.projects.obj', newobj );
        }
        return false;
    },
    'action_status_select-change .js-status'( event, instance ){
        //console.log( 'status action_status_select-change' );
        const status = Template.action_status_select.fn.getSelected( '.js-status' );
        if( status === 'don' ){
            const date = Template.date_select.fn.getDate( '.js-datedone' );
            if( !date ){
                Template.date_select.fn.setDate( '.js-datedone', Date.now());
            }
        } else {
            Template.date_select.fn.setDate( '.js-datedone', null );
        }
    },
    'date_select-change .js-datestart'( event, instance ){
        //console.log( 'dateStart date_select-change' );
    },
    'date_select-change .js-datedue'( event, instance ){
        //console.log( 'dateDue date_select-change' );
    },
    'date_select-change .js-datedone'( event, instance ){
        //console.log( 'dateDone date_select-change' );
        const date = Template.date_select.fn.getDate( '.js-datedone' );
        const obj = Session.get('review.projects.obj');
        const status = date ? 'don' : ( obj.initial_status ? obj.initial_status : 'ina' );
        Template.action_status_select.fn.setSelected( '.js-status', status );
    }
});
