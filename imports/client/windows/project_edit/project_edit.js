/*
 * 'projectEdit' window.
 *
 *  This page lets the user edit a project.
 *
 *  Session variable:
 *  - review.project: the object to be edited, may be null.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> <app layout layer> { gtdid, group, template }
 *              +-> <group layer> { gtdid, group, template }
 *                      |
 *                      +-> actionEdit { gtdid, group, template }
 *                      |       +-> action_panel
 *                      |       +-> collapse_buttons
 *                      |
 *                      +-> projectEdit { gtdid, group, template }
 */
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/collapse_buttons/collapse_buttons.js';
import '/imports/client/components/project_panel/project_panel.js';
import './project_edit.html';

Template.projectEdit.onCreated( function(){
    this.windowed = new ReactiveVar( false );
});

Template.projectEdit.onRendered( function(){
    // open the window if the manager has been initialized
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            const context = this.data;
            console.log( 'calling thoughtEdit.IWindowed creation' );
            console.log( context );
            $( '.'+context.template ).IWindowed({
                template: context.template,
                simone: {
                    buttons: [
                        {
                            text: "Close",
                            click: function(){
                                Template.thoughtEdit.fn.actionClose();
                            }
                        },
                        {
                            text: "OK",
                            click: function(){
                                console.log( $( '.thoughtEdit' ));
                                $( '.thoughtEdit' ).trigger( 'ronin.update' );
                                //Template.thoughtEdit.fn.actionUpdate( self );
                            }
                        }
                    ],
                    group:  context.group,
                    title:  gtd.labelId( null, context.gtdid )
                }
            });
            this.windowed.set( true );
        }
    });
});

Template.projectEdit.helpers({
    okLabel(){
        const label = Session.get( 'review.project' ) ? 'Update' : 'Create';
        return label;
    },
    title(){
        const title = Session.get( 'review.project' ) ? 'Edit project' : 'New project';
        Session.set( 'header.title', title );
        return title;
    }
});

Template.projectEdit.events({
    'click .js-cancel'( ev, instance ){
        Session.set( 'review.project', null );
        FlowRouter.go( 'review.projects' );
        return false;
    },
    'click .js-ok'( ev, instance ){
        const obj = Template.project_panel.fn.getContent();
        $( ev.target ).trigger( 'ronin.model.project.update', obj );
        return false;
    }
});
