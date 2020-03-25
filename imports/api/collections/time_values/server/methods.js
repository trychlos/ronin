import { Meteor } from 'meteor/meteor';
import { csfns } from '/imports/startup/both/collections-csfns.js';

import { TimeValues } from '../time_values.js';

Meteor.methods({
    'time_values.insert'( o ){
        TimeValues.fn.check( o );
        csfns.takeOwnership( o );
        const item = TimeValues.sofns.cleanup( o );
        const ret = TimeValues.insert( item.set );
        console.log( 'time_values.insert "'+o.name+'" returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'time_values.insert',
                'Unable to insert "'+o.name+'" time value' );
        }
        return ret;
    },
    'time_values.remove'( o ){
        csfns.check_editable( o );
        console.log( o );
        let ret = TimeValues.remove( o._id );
        console.log( 'time_values.remove "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'time_values.remove',
                'Unable to remove "'+o.name+'" item' );
        }
        return ret;
    },
   'time_values.update'( o ){
        TimeValues.fn.check( o );
        csfns.takeOwnership( o );
        const item = TimeValues.sofns.cleanup( o );
        const ret = TimeValues.update( o._id, { $set:item.set, $unset:item.unset });
        console.log( 'time_values.update "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'time_values.update',
                'Unable to update "'+o.name+'" time value' );
        }
        return ret;
    },
});
