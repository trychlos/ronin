/*
 * 'actionProcess' window.

 *  A window to transform a thought into an action.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> pageLayout { gtd, page, window }
 *              +-> processPage { gtd, window }
 *                      |
 *                      +-> actionProcess { gtd }
 *                              +-> action_panel
 *                              +-> collapse_buttons
 *                      |
 *                      +-> projectProcess { gtd }
 *
 *  Session variables:
 *  - collect.thought: the to-be-transformed thought.
 */
import '/imports/client/components/action_panel/action_panel.js';
import '/imports/client/components/collapse_buttons/collapse_buttons.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './action_process.html';

Template.actionProcess.onRendered( function(){
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            this.$('div.edit-window').IWindowed({
                template:   'actionProcess',
                group:      'processWindow',
                title:      'Transform into an action'
            });
        }
    });
});

Template.actionProcess.helpers({
    toAction(){
        let action = Object.assign({}, Session.get( 'collect.thought' ));
        action.type = 'A';
        return action;
    },
    title(){
        const title = 'To an action';
        Session.set( 'header.title', title );
        return title;
    }
});

Template.actionProcess.events({
    'click .js-cancel'( ev, instance ){
        Session.set( 'header.title', null );
        Session.set( 'collect.thought', null );
        FlowRouter.go( 'collect' );
        return false;
    },
    'click .js-ok'( ev, instance ){
        const action = Template.action_panel.fn.getContent();
        $( ev.target ).trigger( 'ronin.model.thought.action', action );
        return false;
    }
});