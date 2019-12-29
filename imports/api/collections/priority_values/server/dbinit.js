import { Meteor } from 'meteor/meteor';
import { PriorityValues } from '../priority_values.js';

Meteor.startup(() => {
    if( PriorityValues.find().count() === 0 ){
        const data = [
            { name: 'Must' },
            { name: 'Should' },
            { name: 'Would' },
            { name: 'Could' },
            { name: 'None', deletable: false, default: true },
        ];
        data.forEach( d => {
            PriorityValues.insert( d );
            console.log( "PriorityValues: inserting '"+d.name+"'" );
        });
    }
});
