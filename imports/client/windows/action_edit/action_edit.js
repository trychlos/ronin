/*
 * 'actionEdit' window.
 *
 *  This page lets the user edit an action.
 *
 *  This very same window may be used:
 *
 *  - from the 'process' features group, to insert a new action
 *      > page layout: this is tied to the 'actions' group
 *
 *  - from the 'collect' features group, to transform a thought into an action
 *      > page layout: this is tied to the 'thoughts' group
 *
 *  - from the 'review' features group, to edit an action
 *      > page layout: this is tied to the 'actions' group
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
 *
 *  Session variable:
 *  - review.action: the object to be edited, may be null.
 *      NB: the object may actually be a thought, when requiring for a transformation.
 */
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/collapse_buttons/collapse_buttons.js';
import '/imports/client/components/action_panel/action_panel.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './action_edit.html';

Template.actionEdit.fn = {
    actionClose(){
        console.log( 'Template.actionEdit.fn.actionClose' );
        Session.set( 'review.action', null );
        switch( g.run.layout.get()){
            case LYT_PAGE:
                FlowRouter.go( 'collect' );
                break;
            case LYT_WINDOW:
                $( '.actionEdit' ).IWindowed( 'close' );
                break;
        }
    },
    okLabel: function(){
        return Template.actionEdit.fn.okLabelItem( Session.get( 'review.action' ));
    },
    okLabelItem: function( it ){
        return it ? ( it.type === 'T' ? 'Transform' : 'Update' ) : 'Create';
    }
}

Template.actionEdit.onCreated( function(){
    this.windowed = new ReactiveVar( false );
});

Template.actionEdit.onRendered( function(){
    // open the window if the manager has been initialized
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            const context = Template.currentData();
            $( '.'+context.template ).IWindowed({
                template: context.template,
                simone: {
                    buttons: [
                        {
                            text: "Close",
                            click: function(){
                                Template.actionEdit.fn.actionClose();
                            }
                        },
                        {
                            text: "OK",
                            click: function(){
                                $.pubsub.publish( 'ronin.model.action.update', {
                                    orig: Session.get( 'review.action' ),
                                    edit: Template.action_panel.fn.getContent( $( '.'+context.template ))
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
    })
    this.autorun(() => {
        if( this.windowed.get()){
            const context = Template.currentData();
            const label = Template.actionEdit.fn.okLabel();
            $( '.'+context.template ).IWindowed( 'buttonLabel', 1, label );
        }
    });
});

Template.actionEdit.helpers({
    okLabel(){
        return Template.actionEdit.fn.okLabel();
    },
    title(){
        const title = Session.get( 'review.action' ) ? 'Edit action' : 'New action';
        Session.set( 'header.title', title );
        return title;
    }
});

Template.actionEdit.events({
    'click .js-cancel'( ev, instance ){
        Template.actionEdit.fn.actionClose();
        return false;
    },
    'click .js-ok'( ev, instance ){
        $.pubsub.publish( 'ronin.model.action.update', {
            orig: Session.get( 'review.action' ),
            edit: Template.action_panel.fn.getContent()
        });
        return false;
    }
});
