import { Meteor } from 'meteor/meteor';

import { EnergyValues } from '../energy_values.js';

Meteor.methods({
    'energy_values.insert'( obj ){
        return EnergyValues.insert({
            name: obj.name
        });
    },
    'energy_values.remove'( id ){
        EnergyValues.remove( id );
    },
   'energy_values.update'( id, obj ){
        return EnergyValues.update( id, { $set: {
            name: obj.name
        }});
    },
});
