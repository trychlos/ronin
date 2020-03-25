import { Meteor } from 'meteor/meteor';
import { csfns } from '/imports/startup/both/collections-csfns.js';

import { EnergyValues } from '../energy_values.js';

Meteor.methods({
    'energy_values.insert'( o ){
        EnergyValues.fn.check( o );
        EnergyValues.schema.validate( o );
        csfns.takeOwnership( o );
        const item = EnergyValues.sofns.cleanup( o );
        const ret = EnergyValues.insert( item.set );
        console.log( 'energy_values.insert "'+o.name+'" returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'energy_values.insert',
                'Unable to insert "'+o.name+'" energy value' );
        }
        return ret;
    },
    'energy_values.remove'( o ){
        csfns.check_editable( o );
        console.log( o );
        let ret = EnergyValues.remove( o._id );
        console.log( 'energy_values.remove "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'energy_values.remove',
                'Unable to remove "'+o.name+'" item' );
        }
        return ret;
    },
   'energy_values.update'( o ){
        EnergyValues.fn.check( o );
        EnergyValues.schema.validate( o );
        csfns.takeOwnership( o );
        const item = EnergyValues.sofns.cleanup( o );
        const ret = EnergyValues.update( o._id, { $set:item.set, $unset:item.unset });
        console.log( 'energy_values.update "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'energy_values.update',
                'Unable to update "'+o.name+'" energy value' );
        }
        return ret;
    },
});
