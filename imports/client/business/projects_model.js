/*
 * projects_model.js
 * To be imported at application layer level.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import bootbox from 'bootbox/dist/bootbox.all.min.js';

// one of the windows/panels/components advertise that it has successfully
//  updated the 'id' article, so that any window/panel/component which is
//  opened on it should now be closed
$.pubsub.subscribe( 'ronin.model.reset', ( msg, id ) => {
    console.log( 'projects_model '+msg+' '+id );
    const it = Session.get( 'review.project' );
    if( it && it._id === id ){
        console.log( 'projects_model publish ronin.ui.close' );
        $.pubsub.publish( 'ronin.ui.close', it );
    }
});

// delete the provided project
//  requiring a user confirmation
$.pubsub.subscribe( 'ronin.model.project.delete', ( msg, o ) => {
    bootbox.confirm(
        'You are about to delete the "'+o.project.name+'" project.<br />'+
        'Are you sure ?', function( ret ){
            if( ret ){
                Meteor.call( 'projects.remove', o.project, ( e, res ) => {
                    if( e ){
                        throwError({ type:e.error, message:e.reason });
                    } else {
                        throwSuccess( 'Project successfully deleted' );
                    }
                });
            }
        }
    );
});

// insert or update the provided project
//  or transform a thought into a project
//  if a previous object already existed, then this is an update
//  the page is left if this was an update *and* it has been successful
$.pubsub.subscribe( 'ronin.model.project.update', ( msg, o ) => {
    //console.log( msg );
    //console.log( o.orig );
    //console.log( o.edit );
    Session.set( 'project.dbope', DBOPE_WAIT );
    o.edit.type = 'P';
    const id = o.orig ? o.orig._id : null;
    try {
        Articles.fn.check( id, o.edit );
    } catch( e ){
        console.log( e );
        throwError({ type:e.error, message:e.reason });
        return false;
    }
    if( o.orig ){
        // if nothing has changed, then does nothing
        console.log( msg+' equal='+Articles.fn.equal( o.orig, o.edit ));
        if( Articles.fn.equal( o.orig, o.edit )){
            throwMessage({ type:'warning', message:'Nothing changed' });
            return false;
        }
        Meteor.call('projects.update', id, o.edit, ( e, res ) => {
            if( e ){
                console.log( e );
                throwError({ type:e.error, message:e.reason });
                Session.set( 'project.dbope', DBOPE_ERROR );
            } else {
                if( o.orig.type === 'T' ){
                    throwSuccess( 'Thought successfully transformed' );
                } else {
                    throwSuccess( 'Project successfully updated' );
                }
                Session.set( 'project.dbope', DBOPE_LEAVE );
            }
        });
    } else {
        Meteor.call('projects.insert', o.edit, ( e, res ) => {
            if( e ){
                console.log( e );
                throwError({ type:e.error, message:e.reason });
                Session.set( 'project.dbope', DBOPE_ERROR );
            } else {
                throwSuccess( 'Project successfully inserted' );
                Session.set( 'review.project', 'success' );  // force re-rendering
                Session.set( 'project.dbope', DBOPE_REINIT );
            }
        });
    }
});
