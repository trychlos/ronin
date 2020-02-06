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
 *      +-> pageLayout { gtd, page, window }
 *              +-> collectPage { gtd, window }
 *                      +-> thoughtsList { gtd }
 *                      |
 *                      +-> thoughtEdit { gtd }
 *                              +-> thought_panel
 *                              +-> collapse_buttons
 */
import '/imports/client/components/collapse_buttons/collapse_buttons.js';
import '/imports/client/components/thought_panel/thought_panel.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './thought_edit.html';

Template.thoughtEdit.onCreated( function(){
    //console.log( 'thoughtEdit.onCreated' );
});

Template.thoughtEdit.onRendered( function(){
    //console.log( 'thoughtEdit.onRendered' );
    // open the window if the manager has been initialized
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            $( '.thoughtEdit' ).IWindowed({
                template: 'thoughtEdit',
                simone: {
                    group:  'collect',
                    title:  'Collect thoughts'
                }
            });
        }
    })
});

Template.thoughtEdit.helpers({
    okLabel(){
        const label = Session.get( 'collect.thought' ) ? 'Update' : 'Create';
        return label;
    },
    title(){
        const title = Session.get( 'collect.thought' ) ? 'Edit thought' : 'New thought';
        Session.set( 'header.title', title );
        return title;
    }
});

Template.thoughtEdit.events({
    'click .js-cancel'( ev, instance ){
        Session.set( 'collect.thought', null );
        FlowRouter.go( 'collect' );
        return false;
    },
    'click .js-ok'( ev, instance ){
        const obj = Template.thought_panel.fn.getContent();
        $( ev.target ).trigger( 'ronin.model.thought.update', obj );
        return false;
    }
});

Template.thoughtEdit.onDestroyed( function(){
    console.log( 'thoughtEdit.onDestroyed' );
});
