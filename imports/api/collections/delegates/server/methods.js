import { Meteor } from 'meteor/meteor';
import { csfns } from '/imports/startup/both/collections-csfns.js';
import { Delegates } from '../delegates.js';

Meteor.methods({
    'delegates.insert'( o ){
        delegates.fn.check( o );
        csfns.takeOwnership( o );
        const item = delegates.sofns.cleanup( o );
        const ret = Delegates.insert( item.set );
        console.log( 'delegates.insert "'+o.name+'" returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'delegates.insert',
                'Unable to insert "'+o.name+'" delegate' );
        }
        return ret;
    },
    'delegates.remove'( o ){
        csfns.check_editable( o );
        let ret = Delegates.remove( o._id );
        console.log( 'delegates.remove "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'delegates.remove',
                'Unable to remove "'+o.name+'" item' );
        }
        return ret;
    },
   'delegates.update'( o ){
        delegates.fn.check( o );
        csfns.takeOwnership( o );
        const item = Delegates.sofns.cleanup( o );
        const ret = Delegates.update( o._id, { $set:item.set, $unset:item.unset });
        console.log( 'delegates.update "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'delegates.update',
                'Unable to update "'+o.name+'" delegate' );
        }
        return ret;
    },
});
