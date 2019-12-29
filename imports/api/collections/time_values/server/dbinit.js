import { Meteor } from 'meteor/meteor';
import { TimeValues } from '../time_values.js';

Meteor.startup(() => {
    if( TimeValues.find().count() === 0 ){
        const data = [
            { name: '< 5 mn' },
            { name: '< 1 hour' },
            { name: '< 0,5 day' },
            { name: 'At least 1 day' },
            { name: 'Maybe 1 week' },
            { name: 'More than 1 week' },
            { name: 'None', deletable: false, default: true },
        ];
        data.forEach( d => {
            TimeValues.insert( d );
            console.log( "TimeValues: inserting '"+d.name+"'" );
        });
    }
});
