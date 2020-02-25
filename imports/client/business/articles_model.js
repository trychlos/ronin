/*
 * articless_model.js
 * To be imported at application layer level.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';

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
