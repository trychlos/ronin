/*
 * let the user edit an existing project
 *
 * the view area is the right part of the page
 * editing the project the user has selected in the left tree
 */
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Projects } from '/imports/api/collections/projects/projects.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/ui/components/date_select/date_select.js';
import '/imports/ui/components/topics_select/topics_select.js';
import './project_edit.html';

Template.project_edit.fn = {
};

Template.project_edit.onRendered( function(){
});
  
Template.project_edit.helpers({
    button(){
        const obj = Session.get('review.projects.obj');
        let label = 'Update';
        if( !obj || !obj._id ){
            label = 'Insert';
        }
        return label;
    },
    isFuture( future ){
        const instance = Template.instance();
        if( instance.view.isRendered ){
            const $box = instance.$('.js-future');
            if( $box ){
                $box.prop( 'checked', future );
            }
        }
    },
    it(){
        return Session.get('review.projects.obj');
    }
});

Template.project_edit.events({
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
                purpose: instance.$('.js-purpose').val(),
                vision: instance.$('.js-vision').val(),
                brainstorm: instance.$('.js-brainstorm').val(),
                description: instance.$('.js-description').val(),
                startDate: Template.date_select.fn.getDate( '.js-datestart' ),
                dueDate: Template.date_select.fn.getDate( '.js-datedue' ),
                doneDate: Template.date_select.fn.getDate( '.js-datedone' ),
                future: instance.$('.js-future').is(':checked'),
                notes: instance.$('.js-notes').val(),
            };
            if( id ){
                Meteor.call('projects.update', id, newobj, ( error ) => {
                    if( error ){
                        return throwError({ message: error.message });
                    }
                });
                newobj._id = id;
            } else {
                newobj._id = Meteor.call('projects.insert', newobj, ( error ) => {
                    if( error ){
                        return throwError({ message: error.message });
                    }
                });
            }
            Session.set( 'review.projects.obj', newobj );
        }
        return false;
    }
});
