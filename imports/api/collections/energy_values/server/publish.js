import { Meteor } from 'meteor/meteor';
import { EnergyValues } from '../energy_values.js';

Meteor.publishTransformed( 'energy_values.all', function(){
    return EnergyValues.find().serverTransform({
        // add an 'objType' property to the EnergyValue document
        objType( self ){
            return R_OBJ_ENERGY;
        },
        // add a 'useCount' property
        useCount( self ){
            return 0;
        }
    });
});
