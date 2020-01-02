/*
 * 'details_edit' component.
 *  Let the user edit a project or an action.
 *  Session variables:
 *  - review.projects.obj: the edited object selected in the projects tree.
 * 
 *  This component relies on top subscriptions on Projects and Actions publications.
 */
//import '/imports/client/components/action_edit/action_edit.js';
//import '/imports/client/components/project_edit/project_edit.js';
import './details_edit.html';

Template.details_edit.fn = {
    // details_edit here are set according to the object type set in projects_tree
    details_edit: {
        P: 'js-edit-project',
        A: 'js-edit-action'
    },
    showBody: function( type ){
        //console.log( 'showBody: type='+type );
        const instance = Template.instance();
        if( instance.view.isRendered ){
            Object.keys( Template.details_edit.fn.details_edit ).forEach( it => {
                const $div = instance.$( '.'+Template.details_edit.fn.details_edit[it] );
                if( $div ){
                    $div.hide();
                }
            });
            if( type ){
                const $div = instance.$( '.'+Template.details_edit.fn.details_edit[type] );
                if( $div ){
                    $div.show();
                }
            }
        }
    }
};

Template.details_edit.onRendered( function(){
    Template.details_edit.fn.showBody( null );

    this.autorun(() => {
        const obj = Session.get('review.projects.obj');
        const type = obj ? obj.type : null;
        Template.details_edit.fn.showBody( type );
    });
});

Template.details_edit.helpers({
    headerTitle(){
        const obj = Session.get('review.projects.obj');
        //console.log( obj ? obj.name : '');
        let header = '<>';
        if( obj && obj.type ){
            if( obj.type === 'A' ){
                header = 'Action details_edit';
            }
            if( obj.type === 'P' ){
                header = 'Project details_edit';
            }
        }
        return header;
    }
});

Template.details_edit.events({
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
