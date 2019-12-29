import { Meteor } from 'meteor/meteor';
import { EnergyValues } from '../energy_values.js';

Meteor.startup(() => {
    if( EnergyValues.find().count() === 0 ){
        const data = [
            { name: 'Low mental effort' },
            { name: 'Middle mental effort' },
            { name: 'High mental effort' },
            { name: 'Low physical effort' },
            { name: 'Middle physical effort' },
            { name: 'High physical effort' },
            { name: 'None', deletable: false, default: true },
        ];
        data.forEach( d => {
            EnergyValues.insert( d );
            console.log( "EnergyValues: inserting '"+d.name+"'" );
        });
    }
});
