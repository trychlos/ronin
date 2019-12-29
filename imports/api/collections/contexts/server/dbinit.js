import { Meteor } from 'meteor/meteor';
import { Contexts } from '../contexts.js';

Meteor.startup(() => {
    if( Contexts.find().count() === 0 ){
        const data = [
            { name: 'None',  code: 'non', deletable: false, default: true }
        ];
        data.forEach( d => {
            Contexts.insert( d );
            console.log( "Contexts: inserting '"+d.name+"'" );
        });
    }
});
