import { Meteor } from 'meteor/meteor';
import { Projects } from '../projects.js';

Meteor.startup(() => {
    if( Projects.find().count() === 0 ){
        const data = [
            { name: 'None', code: 'non', select_order: 0 }
        ];
        data.forEach( d => {
            Projects.insert( d );
            console.log( "Projects: inserting '"+d.name+"'" );
        });
    }
});
