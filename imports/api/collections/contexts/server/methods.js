import { Meteor } from 'meteor/meteor';

import { Contexts } from '../contexts.js';

Meteor.methods({
    'contexts.insert'( obj ){
        return Contexts.insert({
            name: obj.name,
            description: obj.description
        });
    },
    'contexts.remove'( o ){
        //Articles.fn.check_editable( o );
        let ret = Contexts.remove( o._id );
        console.log( 'Contexts.remove "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'contexts.remove',
                'Unable to remove "'+o.name+'" item' );
        }
        return ret;
    },
   'contexts.update'( id, obj ){
        return Contexts.update( id, { $set: {
            name: obj.name,
            description: obj.description
        }});
    },
});
