import { Meteor } from 'meteor/meteor';

import { Contexts } from '../contexts.js';

Meteor.methods({
    'contexts.get'( id ){
        const o = Contexts.findOne({ _id:id });
        console.log( o );
        return o;
    },
    'contexts.insert'( obj ){
        return Contexts.insert({
            name: obj.name,
            description: obj.description
        });
    },
    'contexts.remove'( id ){
        Contexts.remove( id );
    },
   'contexts.update'( id, obj ){
        return Contexts.update( id, { $set: {
            name: obj.name,
            description: obj.description
        }});
    },
});
