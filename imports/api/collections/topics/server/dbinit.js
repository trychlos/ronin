import { Meteor } from 'meteor/meteor';
import { Topics } from '../topics.js';

Meteor.startup(() => {
    if( Topics.find().count() === 0 ){
        const data = [
            { name: 'None', code: 'def', deletable: false, default: true },
        ];
        data.forEach( d => {
            Topics.insert( d );
            console.log( "TimeValues: inserting '"+d.name+"'" );
        });
    }
});
