/*
 * 'actionEdit' window.
 *
 *  This page lets the user edit an action.
 *
 *  Session variable:
 *  - review.action: the object to be edited, may be null.
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
import '/imports/client/components/action_panel/action_panel.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './action_edit.html';

Template.actionEdit.onRendered( function(){
    // open the window if the manager has been initialized
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            const context = this.data;
            $( '.'+context.template ).IWindowed({
                template: context.template,
                simone: {
                    group:  context.group,
                    title:  gtd.labelId( null, context.gtdid )
                }
            });
        }
    })
});

Template.actionEdit.helpers({
    okLabel(){
        const label = Session.get( 'review.action' ) ? 'Update' : 'Create';
        return label;
    },
    title(){
        const title = Session.get( 'review.action' ) ? 'Edit action' : 'New action';
        Session.set( 'header.title', title );
        return title;
    }
});

Template.actionEdit.events({
    'click .js-cancel'( ev, instance ){
        Session.set( 'review.action', null );
        FlowRouter.go( 'review.actions' );
        return false;
    },
    'click .js-ok'( ev, instance ){
        const obj = Template.action_panel.fn.getContent();
        $( ev.target ).trigger( 'ronin.model.action.update', obj );
        return false;
    }
});
