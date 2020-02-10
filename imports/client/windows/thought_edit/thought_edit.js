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
import { Articles } from '/imports/api/collections/articles/articles.js';
import '/imports/client/components/collapse_buttons/collapse_buttons.js';
import '/imports/client/components/thought_panel/thought_panel.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './thought_edit.html';

Template.thoughtEdit.fn = {
    // on close, go back to thoughtsList window
    actionClose: function(){
        Session.set( 'collect.thought', null );
        if( g.run.layout.get() === LYT_PAGE ){
            FlowRouter.go( 'collect' );
        }
        if( g.run.layout.get() === LYT_WINDOW ){
            $( '.thoughtEdit' ).IWindowed( 'close' );
        }
    },
    // insert or update the provided thought
    //  if a previous object already existed, then this is an update
    //  the page is left if this was an update *and* it has been successful
    actionUpdate: function( instance ){
        Session.set( 'collect.dbope', DBOPE_WAIT );
        const objEdit = Template.thought_panel.fn.getContent( instance );
        console.log( objEdit );
        const objOrig = Session.get( 'collect.thought' );
        const id = objOrig ? objOrig._id : null;
        try {
            Articles.fn.check( id, objEdit );
        } catch( e ){
            console.log( e );
            throwError({ type:e.error, message: e.reason });
            return false;
        }
        if( objOrig ){
            // if nothing has changed, then does nothing
            if( Articles.fn.equal( objOrig, objEdit )){
                throwMessage({ type:'warning', message:'Nothing changed' });
                return false;
            }
            Meteor.call('thoughts.update', id, objEdit, ( e, res ) => {
                if( e ){
                    console.log( e );
                    throwError({ type:e.error, message: e.reason });
                    Session.set( 'collect.dbope', DBOPE_ERROR );
                } else {
                    throwSuccess( 'Thought successfully updated' );
                    Session.set( 'collect.dbope', DBOPE_LEAVE );
                }
            });
        } else {
            Meteor.call('thoughts.insert', objEdit, ( e, res ) => {
                if( e ){
                    console.log( e );
                    throwError({ type:e.error, message: e.reason });
                    Session.set( 'collect.dbope', DBOPE_ERROR );
                } else {
                    throwSuccess( 'Thought successfully inserted' );
                    Session.set( 'collect.thought', 'success' );  // force re-rendering
                    Session.set( 'collect.dbope', DBOPE_REINIT );
                }
            });
        }
    },
    okLabel: function(){
        return Template.thoughtEdit.fn.okLabelThought( Session.get( 'collect.thought' ));
    },
    okLabelThought: function( it ){
        return it ? 'Update' : 'Create';
    }
}

Template.thoughtEdit.onCreated( function(){
    this.windowed = new ReactiveVar( false );
});

Template.thoughtEdit.onRendered( function(){
    //console.log( 'thoughtEdit.onRendered' );
    const self = this;
    // open the window if the manager has been initialized
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            //$( '.thoughtEdit' ).IWindowed();
            $( '.thoughtEdit' ).window();
            /*
            {
                template: 'thoughtEdit',
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
                    group:  'collect',
                    title:  'Collect thoughts'
                }
            });
            this.windowed.set( true );
            */
        }
    });
    this.autorun(() => {
        if( this.windowed.get()){
            const label = Template.thoughtEdit.fn.okLabel();
            $( '.thoughtEdit' ).IWindowed( 'buttonLabel', 1, label );
        }
    })
    $( '.thoughtEdit' ).on( 'ronin.update', function(){
        console.log( 'on ronin.update' );
    });
    /*
    $( '.js-ok' ).click( function(){
        console.log( 'on js-ok click' );
    });
    */
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
        console.log( 'event js-cancel' );
        //Template.thoughtEdit.fn.actionClose();
        //return false;
    },
    // collapse_buttons ok button
    'click .js-ok': function( ev, instance ){
        console.log( 'event js-ok' );
        //Template.thoughtEdit.fn.actionUpdate( instance );
        //return false;
    },
    // collapse_buttons ok button
    'click .wsf-footer': function( ev, instance ){
        console.log( 'event wsf-footer' );
        //Template.thoughtEdit.fn.actionUpdate( instance );
        //return false;
    },
    'ronin.update .thoughtEdit'( ev, instance ){
        console.log( 'event ronin.update' );
    }
});

Template.thoughtEdit.onDestroyed( function(){
    console.log( 'thoughtEdit.onDestroyed' );
});
