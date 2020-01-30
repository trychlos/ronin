/*
 * 'processAction' window.

 *  A window to transform a thought into an action.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> pageLayout { main, window }
 *              +-> processPage { window, group }
 *                      +-> processAction { group }
 *
 *  Session variables:
 *  - collect.thought: the to-be-transformed thought.
 */
import '/imports/client/components/to_action/to_action.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './process_action.html';

Template.processAction.onRendered( function(){
    console.log( 'processAction: onRendered' );
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
    }
});

Template.processAction.events({
    'click .js-cancel'( ev, instance ){
        Session.set( 'collect.thought', null );
        FlowRouter.go( 'collect' );
        return false;
    },
    'click .js-transform'(event,instance){
        event.preventDefault();
        const prevNum = Session.get('process.thoughts.num');
        const prevCount = Template.processWindow.fn.thoughtsCount();
        // build an object which embeds both the initial thought id
        //  and the to be created action
        // the server code will take care of transforming the former
        //  into the later
        Meteor.call('actions.fromThought', {
            thought: {
                id: instance.$('#to-action-thought-id').text()
            },
            action: {
                name: instance.$('.js-name').val(),
                topic: Template.topics_select.fn.getSelected( '.js-topic' ),
                context: Template.contexts_select.fn.getSelected( '.js-context' ),
                status: Template.action_status_select.fn.getSelected( '.js-status' ),
                outcome: instance.$('.js-outcome').val(),
                description: instance.$('.js-description').val(),
                start: Template.date_select.fn.getDate( '.js-datestart' ),
                due: Template.date_select.fn.getDate( '.js-datedue' ),
                done: Template.date_select.fn.getDate( '.js-datedone' ),
                project: Template.projects_select.fn.getSelected( '.js-project' )
            }
        }, ( error ) => {
            if( error ){
                return throwError({ message: error.message });
            }
        });
        // the client side reactive var may not be updated when calling
        //  the method - this is the reason why we provide a sure photo
        //  of the previous counters
        Template.processWindow.fn.thoughtRemoved( prevNum, prevCount );
        return false;
    }
});
