import { Meteor } from 'meteor/meteor';
import { EnergyValues } from '../energy_values.js';

Meteor.publish('energy_values.all', function(){
    return EnergyValues.find();
});
