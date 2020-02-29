/*
 * articles_model.js
 * To be imported at application layer level.
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
    Meteor.call( 'articles.ownership', o, ( e, res ) => {
        if( e ){
            throwError({ type:e.error, message:e.reason });
        } else {
            throwSuccess( 'Ownership successfully taken' );
        }
    });
});
