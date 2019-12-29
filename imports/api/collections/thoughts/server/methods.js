import { Meteor } from 'meteor/meteor';

import { Thoughts } from '../thoughts.js';

Meteor.methods({
    'thoughts.insert'( obj ){
        return Thoughts.insert({
            name: obj.name,
            description: obj.description,
            topic: obj.topic
        });
    },
    'thoughts.remove'( id ){
        console.log( 'thoughts.remove id='+id );
        Thoughts.remove( id );
    },
    'thoughts.update'( id, obj ){
        return Thoughts.update( id, { $set: {
            name: obj.name,
            description: obj.description,
            topic: obj.topic
        }});
    },
});

