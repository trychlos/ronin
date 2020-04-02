/*
 * /imports/startup/both/collections-csfns.js
 *
 * Collections miscellaneous functions.
 *
 * csfns.fn are functions which may be called both from the client and the server.
 *
 * See <collection>/server/sofns.js for server-only functions.
 * See <collection>/server/methods.js for server functions remotely callable from
 *  the client (aka Meteor RPC).
 */
import { ActionStatus } from 'meteor/pwi:ronin-action-status';

export const csfns = {
    // must be editable by this user
    //  anyone may edit an un-owned documents
    check_editable: function( o ){
        const currentUser = Meteor.userId();
        //console.log( 'check_editable: current.userId='+currentUser+' o.userId='+o.userId );
        if( o.userId ){
            if( currentUser !== o.userId ){
                throw new Meteor.Error(
                    'unauthorized',
                    'You are not allowed to edit this document'
                );
            }
        }
    },
    // name is mandatory
    check_name: function( o ){
        if( !o.name ){
            throw new Meteor.Error(
                'name.required',
                'Mandatory name is empty'
            );
        }
    },
    // object must be defined
    check_object: function( o ){
        if( !o ){
            throw new Meteor.Error(
                'undefined',
                'Object is not defined'
            );
        }
    },
    // action status must be valid
    check_status: function( o ){
        if( !ActionStatus.isValid( o.status )){
            throw new Meteor.Error(
                'invalid',
                'Status is not valid, found "'+o.status+'", allowed values are ['+ActionStatus.getValid().join( ',' )+']'
            );
        }
    },
    // topic must exist
    //  nb: unable to be sure to have a valid check client-side
    //      as this depends of the active subscriptions
    check_topic: function( o ){
        if( o.topic ){
        }
    },

    /* Test if two objects are equals
    *  mainly used to prevent too many useless updates
    *  Callable both from client and server, but mainly used from the client.
    *  Doesn't modify any object.
    *  Doesn't throw any exception, but returns true (resp. false) if the provided
    *  objects are equal (resp. different).
    */
   equals: function( a, b, cb ){
        let ret = true;
        if( a ){
            if( b ){
                ret = cb( a, b );
            } else {
                ret = false;
            }
        } else if( b ){
            ret = false;
        }
        return ret;
    },
    equalDates: function( a, b ){
        return csfns.equals( a, b, ( e, f ) => {
            return moment( e ).isSame( f, 'day' );
        })
    },
    equalStrs: ( a, b ) => {
        return csfns.equals( a, b, ( e, f ) => {
            return e === f;
        });
    },
    // Rationale: if the item is not owned by anyone, then the currently logged-in
    //  user may take ownership of it.
    //  We have so four states:
    //  - there is no user currently logged in: no ownership can be taken
    //  - user already has ownership of the item: taking ownership is not relevant
    //  - the item does not yet belong to anyone: ownership could be taken
    //  - the item belongs to someone else: taking ownership is forbidden.
    takeableStatus: {
        'NOT': 'no user is logged-in; no ownership can be taken',
        'HAS': 'logged-in user already has ownserhip of the item',
        'CAN': 'item does not belong to anyone, ownership can be taken',
        'FOR': 'item belongs to someone else, taking ownship is forbidden'
    },
    takeableGetStatus: function( item ){
        const current = Meteor.userId();
        if( !current ){
            return 'NOT';
        }
        if( item.userId === current ){
            return 'HAS';
        }
        return item.userId ? 'FOR' : 'CAN';
    },
    // Take the item ownership if this is possible.
    // Throws a server exception if this is forbidden.
    // Rationale: when updating an object, take ownership of it if the object
    //  was still un-owned.
    //  Throws an exception is ownership is not takeable here, which should have
    //  been previously checked.
    takeOwnership: function( item ){
        let _throwsError = function(){
            throw new Meteor.Error(
                'code',
                'Ownership is not takeable here and there. Should have been prevented sooner'
            );
        }
        const status = csfns.takeableGetStatus( item );
        if( status === 'FOR' ){
            // item is owned by someone else!
            // the UI should had prevent this
            _throwsError();
        }
        if( status === 'CAN' ){
            item.userId = Meteor.userId();
        }
        if( status === 'NOT' && item.userId ){
            // item is owned by someone, but nobody is logged-in
            // the UI should had prevent this
            _throwsError();
        }
    }
}
