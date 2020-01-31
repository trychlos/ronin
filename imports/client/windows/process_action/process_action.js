/*
 * 'processAction' window.

 *  A window to transform a thought into an action.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> pageLayout { gtd, page, window }
 *              +-> processPage { gtd, window }
 *                      +-> processAction { gtd }
 *
 *  Session variables:
 *  - collect.thought: the to-be-transformed thought.
 */
import '/imports/client/components/to_action/to_action.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './process_action.html';

Template.processAction.onRendered( function(){
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            this.$('div.edit-window').IWindowed({
                template:   'processAction',
                group:      'processWindow',
                title:      'Transform into an action'
            });
        }
    });
});

Template.processAction.helpers({
    thought(){
        return Session.get( 'collect.thought' );
    },
    title(){
        const title = 'Transform into an action';
        Session.set( 'header.title', title );
        return title;
    }
});

Template.processAction.events({
    'click .js-cancel'( ev, instance ){
        Session.set( 'header.title', null );
        Session.set( 'collect.thought', null );
        FlowRouter.go( 'collect' );
        return false;
    }
});
