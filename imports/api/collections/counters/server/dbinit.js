import { Meteor } from 'meteor/meteor';
import { Counters } from '../counters.js';

// only insert a lastNid for projects, as the nid=1 is reserved by the root
Meteor.startup(() => {
    if( Counters.find().count() === 0 ){
        const data = [
            { name: 'projects', nid: 1 }
        ];
        data.forEach( d => {
            Counters.insert( d );
            console.log( "Counters: inserting '"+d.name+"'" );
        });
    }
});
