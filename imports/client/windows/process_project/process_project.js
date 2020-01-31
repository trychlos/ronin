/*
 * 'processProject' window.

 *  A window to transform a thought into a project.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> pageLayout { gtd, page, window }
 *              +-> processPage { gtd, window }
 *                      +-> processProject { gtd }
 *
 *  Session variables:
 *  - collect.thought: the to-be-transformed thought.
 */
import '/imports/client/components/to_project/to_project.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './process_action.html';

Template.processProject.onRendered( function(){
    console.log( 'processProject: onRendered' );
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            this.$('div.edit-window').IWindowed({
                template:   'processProject',
                group:      'processWindow',
                title:      'Transform into a project'
            });
        }
    });
});

Template.processProject.helpers({
    thought(){
        return Session.get( 'collect.thought' );
    }
});

Template.processProject.events({
    'click .js-cancel'( ev, instance ){
        Session.set( 'header.title', null );
        Session.set( 'collect.thought', null );
        FlowRouter.go( 'collect' );
        return false;
    }
});
