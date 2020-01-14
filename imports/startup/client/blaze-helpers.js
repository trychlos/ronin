/*
 * /imports/startup/client/blaze-helpers.js
 *
 *  Register global helpers.
 */

Template.registerHelper(
    'lastUpdated', function( obj ){
        if( obj ){
            if( obj.updatedAt ){
                return 'Last updated on '+moment( obj.updatedAt ).format( 'DD-MM-YYYY H:mm' );
            } else if( obj.createdAt ){
                return 'Created on '+moment( obj.createdAt ).format( 'DD-MM-YYYY H:mm' );
            }
        }
        return '';
    }
);
