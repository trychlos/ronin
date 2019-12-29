import { Meteor } from 'meteor/meteor';

import { Topics } from '../topics.js';

Meteor.methods({
    'topics.insert'( obj ){
        return Topics.insert({
            name: obj.name,
            description: obj.description,
            textColor: obj.textColor,
            backgroundColor: obj.backgroundColor
        });
    },
    'topics.remove'( id ){
        Topics.remove( id );
    },
    'topics.setBackgroundColor'( id, color ){
        return Topics.update( id, { $set: { 
            backgroundColor: color
        }});
    },
    'topics.setTextColor'( id, color ){
        return Topics.update( id, { $set: { 
            textColor: color
        }});
    },
    'topics.update'( id, obj ){
        return Topics.update( id, { $set: {
            name: obj.name,
            description: obj.description,
            textColor: obj.textColor,
            backgroundColor: obj.backgroundColor
        }});
    },
});
