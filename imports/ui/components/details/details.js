/*
 * 'details' component.
 *  Let the user edit a project or an action.
 *  Session variables:
 *  - review.projects.obj: the edited object selected in the projects tree.
 * 
 *  This component relies on top subscriptions on Projects and Actions publications.
 */
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { ActionStatus } from '/imports/api/collections/action_status/action_status.js';
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/ui/components/action_edit/action_edit.js';
import '/imports/ui/components/project_edit/project_edit.js';
import './details.html';

Template.details.fn = {
    // details here are set according to the object type set in projects_tree
    details: {
        P: 'js-edit-project',
        A: 'js-edit-action'
    },
    showBody: function( type ){
        //console.log( 'showBody: type='+type );
        const instance = Template.instance();
        if( instance.view.isRendered ){
            Object.keys( Template.details.fn.details ).forEach( it => {
                const $div = instance.$( '.'+Template.details.fn.details[it] );
                if( $div ){
                    $div.hide();
                }
            });
            if( type ){
                const $div = instance.$( '.'+Template.details.fn.details[type] );
                if( $div ){
                    $div.show();
                }
            }
        }
    }
};

Template.details.onCreated( function(){
    this.subscribe('action_status.all');
    this.subscribe('contexts.all');
    this.subscribe('topics.all');
});

Template.details.onRendered( function(){
    Template.details.fn.showBody( null );

    this.autorun(() => {
        const obj = Session.get('review.projects.obj');
        const type = obj ? obj.type : null;
        Template.details.fn.showBody( type );
    });
});

Template.details.helpers({
    headerTitle(){
        const obj = Session.get('review.projects.obj');
        //console.log( obj ? obj.name : '');
        let header = '<>';
        if( obj && obj.type ){
            if( obj.type === 'A' ){
                header = 'Action details';
            }
            if( obj.type === 'P' ){
                header = 'Project details';
            }
        }
        return header;
    }
});

Template.details.events({
    'click .js-new-action'( event, instance ){
        const obj = {
            type: 'A',
            name: 'New action'
        };
        Session.set( 'review.projects.obj', obj );
    },
    'click .js-new-project'( event, instance ){
        const obj = {
            type: 'P',
            name: 'New project'
        };
        Session.set( 'review.projects.obj', obj );
    }
});
