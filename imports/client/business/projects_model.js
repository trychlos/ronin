/*
 * projects_model.js
 * To be imported at application layer level.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';

// insert or update the provided project
//  or transform a thought into a project
//  if a previous object already existed, then this is an update
//  the page is left if this was an update *and* it has been successful
$.pubsub.subscribe( 'ronin.model.project.update', ( msg, o ) => {
    //console.log( msg );
    //console.log( o );
    Session.set( 'project.dbope', DBOPE_WAIT );
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
        //console.log( msg+' equal='+Articles.fn.equal( o.orig, o.edit ));
        o.edit.userId = o.orig.userId;
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
                    $.pubsub.publish( 'ronin.ui.item.transformed', o.orig );
                } else {
                    throwSuccess( 'Project successfully updated' );
                }
                $.pubsub.publish( 'ronin.ui.item.updated', o );
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
                Session.set( 'project.dbope', DBOPE_REINIT );
            }
        });
    }
});
