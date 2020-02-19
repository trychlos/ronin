/*
 * 'projectEdit' window.
 *
 *  This page lets the user edit a project.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> <app layout layer> { gtdid, group, template }
 *              +-> <group layer> { gtdid, group, template }
 *                      |
 *                      +-> actionEdit { gtdid, group, template }
 *                      |       +-> action_panel
 *                      |       +-> wsf_collapse_buttons
 *                      |
 *                      +-> projectEdit { gtdid, group, template }
 *
 *  Session variable:
 *  - review.project: the object to be edited, may be null.
 */
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/wsf_collapse_buttons/wsf_collapse_buttons.js';
import '/imports/client/components/project_panel/project_panel.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './project_edit.html';

Template.projectEdit.fn = {
    actionClose(){
        //console.log( 'Template.projectEdit.fn.actionClose' );
        Session.set( 'review.project', null );
        switch( g.run.layout.get()){
            case LYT_PAGE:
                FlowRouter.go( g.run.back );
                break;
            case LYT_WINDOW:
                $().IWindowed.close( '.projectEdit' );
                break;
        }
    },
    okLabel: function(){
        return Template.projectEdit.fn.okLabelItem( Session.get( 'review.project' ));
    },
    okLabelItem: function( it ){
        return it ? ( it.type === 'T' ? 'Transform' : 'Update' ) : 'Create';
    }
}

Template.projectEdit.onCreated( function(){
    console.log( 'projectEdit.onCreated' );
    // this let us close a projectEdit window if the project has been
    //  transformed in something else elsewhere
    $.pubsub.subscribe( 'ronin.ui.action.close', ( msg, o ) => {
        console.log( 'projectEdit '+msg+' '+o._id );
        const p = Session.get( 'review.project' );
        if( p && p._id === o._id ){
            Template.projectEdit.fn.actionClose();
        }
    });
});

Template.projectEdit.onRendered( function(){
    // open the window if the manager has been initialized
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            const context = Template.currentData();
            const label = Template.projectEdit.fn.okLabel();
            $( '.'+context.template ).IWindowed({
                template: context.template,
                simone: {
                    buttons: [
                        {
                            text: "Close",
                            click: function(){
                                Template.projectEdit.fn.actionClose();
                            }
                        },
                        {
                            text: label,
                            click: function(){
                                $.pubsub.publish( 'ronin.model.project.update', {
                                    orig: Session.get( 'review.project' ),
                                    edit: Template.project_panel.fn.getContent()
                                });
                            }
                        }
                    ],
                    group:  context.group,
                    title:  gtd.labelId( null, context.gtdid )
                }
            });
        }
    });
});

Template.projectEdit.helpers({
    okLabel(){
        return Template.projectEdit.fn.okLabel();
    },
    title(){
        const title = Session.get( 'review.project' ) ? 'Edit project' : 'New project';
        Session.set( 'header.title', title );
        return title;
    }
});

Template.projectEdit.events({
    'click .js-cancel'( ev, instance ){
        Template.projectEdit.fn.actionClose();
        return false;
    },
    'click .js-ok'( ev, instance ){
        $.pubsub.publish( 'ronin.model.project.update', {
            orig: Session.get( 'review.project' ),
            edit: Template.project_panel.fn.getContent()
        });
        return false;
    }
});
