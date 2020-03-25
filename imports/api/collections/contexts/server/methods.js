import { Meteor } from 'meteor/meteor';
import { csfns } from '/imports/startup/both/collections-csfns.js';

import { Contexts } from '../contexts.js';

Meteor.methods({
    'contexts.insert'( o ){
        Contexts.fn.check( o );
        Contexts.schema.validate( o );
        csfns.takeOwnership( o );
        const item = Contexts.sofns.cleanup( o );
        const ret = Contexts.insert( item.set );
        console.log( 'Contexts.insert "'+o.name+'" returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'contexts.insert',
                'Unable to insert "'+o.name+'" context' );
        }
        return ret;
    },
    'contexts.remove'( o ){
        csfns.check_editable( o );
        let ret = Contexts.remove( o._id );
        console.log( 'Contexts.remove "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'contexts.remove',
                'Unable to remove "'+o.name+'" item' );
        }
        return ret;
    },
   'contexts.update'( o ){
        Contexts.fn.check( o );
        Contexts.schema.validate( o );
        csfns.takeOwnership( o );
        const item = Contexts.sofns.cleanup( o );
        const ret = Contexts.update( o._id, { $set:item.set, $unset:item.unset });
        console.log( 'Contexts.update "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'contexts.update',
                'Unable to update "'+o.name+'" context' );
        }
        return ret;
    },
});
