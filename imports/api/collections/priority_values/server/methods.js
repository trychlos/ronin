import { Meteor } from 'meteor/meteor';
import { csfns } from '/imports/startup/both/collections-csfns.js';

import { PriorityValues } from '../priority_values.js';

Meteor.methods({
    'priority_values.insert'( o ){
        PriorityValues.fn.check( o );
        csfns.takeOwnership( o );
        const item = PriorityValues.sofns.cleanup( o );
        const ret = PriorityValues.insert( item.set );
        console.log( 'priority_values.insert "'+o.name+'" returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'priority_values.insert',
                'Unable to insert "'+o.name+'" priority value' );
        }
        return ret;
    },
    'priority_values.remove'( o ){
        csfns.check_editable( o );
        console.log( o );
        let ret = PriorityValues.remove( o._id );
        console.log( 'priority_values.remove "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'priority_values.remove',
                'Unable to remove "'+o.name+'" item' );
        }
        return ret;
    },
   'priority_values.update'( o ){
        PriorityValues.fn.check( o );
        csfns.takeOwnership( o );
        const item = PriorityValues.sofns.cleanup( o );
        const ret = PriorityValues.update( o._id, { $set:item.set, $unset:item.unset });
        console.log( 'priority_values.update "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'priority_values.update',
                'Unable to update "'+o.name+'" priority value' );
        }
        return ret;
    },
});
