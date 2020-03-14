/*
 * articles_model.js
 * To be imported at application layer level.
 *
 * Messages:
 *  - ronin.model.article.delete
 *  - ronin.model.article.ownership
 *  - ronin.model.article.reparent
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import bootbox from 'bootbox/dist/bootbox.all.min.js';
import _ from 'lodash';

// delete the provided item
//  requiring a user confirmation
$.pubsub.subscribe( 'ronin.model.article.delete', ( msg, o ) => {
    let label = 'item';
    switch( o.type ){
        case 'A':
            label = 'action';
            break;
        case 'M':
            label = 'maybe';
            break;
        case 'P':
            label = 'project';
            break;
        case 'T':
            label = 'thought';
            break;
    }
    bootbox.confirm(
        'You are about to delete the "'+o.name+'" '+label+'.<br />'+
        'Are you sure ?', function( ret ){
            if( ret ){
                Meteor.call( 'articles.remove', o, ( e, res ) => {
                    if( e ){
                        throwError({ type:e.error, message:e.reason });
                    } else {
                        throwSuccess( _.capitalize( label )+' successfully deleted' );
                        $.pubsub.publish( 'ronin.ui.item.deleted', o );
                    }
                });
            }
        }
    );
});

// take ownership of the item
$.pubsub.subscribe( 'ronin.model.article.ownership', ( msg, o ) => {
    try {
        Articles.fn.check( o );
        Articles.fn.takeOwnership( o );
    } catch( e ){
        console.log( e );
        throwError({ type:e.error, message:e.reason });
        return false;
    }
    Meteor.call( 'articles.ownership', o, ( e, res ) => {
        if( e ){
            throwError({ type:e.error, message:e.reason });
        } else {
            throwSuccess( 'Ownership successfully taken' );
        }
    });
});

// reparent the item
$.pubsub.subscribe( 'ronin.model.article.reparent', ( msg, o ) => {
    try {
        Articles.fn.check( o.item );
        Articles.fn.takeOwnership( o.item );
    } catch( e ){
        console.log( e );
        throwError({ type:e.error, message:e.reason });
        return false;
    }
    Meteor.call( 'articles.reparent', o, ( e, res ) => {
        if( e ){
            throwError({ type:e.error, message:e.reason });
        }
    });
});
