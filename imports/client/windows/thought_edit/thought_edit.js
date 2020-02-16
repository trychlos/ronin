/*
 * 'thoughtEdit' window.
 *
 *  This page lets the user edit a thought.
 *
 *  Session variable:
 *  - collect.thought: the object to be edited, may be null.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> <app layout layer> { gtdid, group, template }
 *              +-> <group layer> { gtdid, group, template }
 *                      |
 *                      +-> thoughtsList { gtdid, group, template }
 *                              +-> thought_panel in window-based layout
 *                              +-> thoughts_list
 *                              +-> plus_button in page-based layout
 *                      |
 *                      +-> thoughtEdit { gtdid, group, template }
 *
 *  Parameters:
 *  - 'data': the layout context built in appLayout, and passed in by group layer.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/api/resources/dbope_status/dbope_status.js';
import '/imports/client/components/collapse_buttons/collapse_buttons.js';
import '/imports/client/components/thought_panel/thought_panel.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './thought_edit.html';

Template.thoughtEdit.fn = {
    // on close, go back to thoughtsList window
    actionClose: function(){
        //console.log( 'Template.thoughtEdit.fn.actionClose' );
        Session.set( 'collect.thought', null );
        switch( g.run.layout.get()){
            case LYT_PAGE:
                FlowRouter.go( g.run.back );
                break;
            case LYT_WINDOW:
                $().IWindowed.close( '.thoughtEdit' );
                break;
        }
    },
    okLabel: function(){
        return Template.thoughtEdit.fn.okLabelItem( Session.get( 'collect.thought' ));
    },
    okLabelItem: function( it ){
        return it ? 'Update' : 'Create';
    }
}

Template.thoughtEdit.onCreated( function(){
    console.log( 'thoughtEdit.onCreated' );
    this.windowed = new ReactiveVar( false );
});

Template.thoughtEdit.onRendered( function(){
    console.log( 'thoughtEdit.onRendered' );
    // open the window if the manager has been initialized
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            const context = Template.currentData();
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
                                $.pubsub.publish( 'ronin.model.thought.update', {
                                    orig: Session.get( 'collect.thought' ),
                                    edit: Template.thought_panel.fn.getContent()
                                });
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
    this.autorun(() => {
        if( this.windowed.get()){
            const context = Template.currentData();
            const label = Template.thoughtEdit.fn.okLabel();
            $( '.'+context.template ).IWindowed( 'buttonLabel', 1, label );
        }
    });
    this.autorun(() => {
        $.pubsub.subscribe( 'ronin.ui.close', ( msg, o ) => {
            console.log( 'thoughtEdit '+msg+' '+o._id );
            const t = Session.get( 'collect.thought' );
            if( t && t._id === o._id ){
                Template.thoughtEdit.fn.actionClose();
            }
        });
    });
});

Template.thoughtEdit.helpers({
    okLabel(){
        return Template.thoughtEdit.fn.okLabel();
    },
    title(){
        const title = Session.get( 'collect.thought' ) ? 'Edit thought' : 'New thought';
        Session.set( 'header.title', title );
        return title;
    }
});

Template.thoughtEdit.events({
    // collapse_buttons cancel button
    'click .js-cancel': function( ev, instance ){
        Template.thoughtEdit.fn.actionClose();
        return false;
    },
    // collapse_buttons ok button
    'click .js-ok': function( ev, instance ){
        $.pubsub.publish( 'ronin.model.thought.update', {
            orig: Session.get( 'collect.thought' ),
            edit: Template.thought_panel.fn.getContent()
        });
        return false;
    }
});

Template.thoughtEdit.onDestroyed( function(){
    console.log( 'thoughtEdit.onDestroyed' );
});
