import { Meteor } from 'meteor/meteor';
import { csfns } from '/imports/startup/both/collections-csfns.js';

import { Topics } from '../topics.js';

Meteor.methods({
    'topics.insert'( o ){
        Topics.fn.check( o );
        csfns.takeOwnership( o );
        const item = Topics.sofns.cleanup( o );
        const ret = Topics.insert( item.set );
        console.log( 'Topics.insert "'+o.name+'" returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'topics.insert',
                'Unable to insert "'+o.name+'" topic' );
        }
        return ret;
    },
    'topics.remove'( o ){
        csfns.check_editable( o );
        let ret = Topics.remove( o._id );
        console.log( 'Topics.remove "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'topics.remove',
                'Unable to remove "'+o.name+'" item' );
        }
        return ret;
    },
   'topics.update'( o ){
        Topics.fn.check( o );
        csfns.takeOwnership( o );
        const item = Topics.sofns.cleanup( o );
        const ret = Topics.update( o._id, { $set:item.set, $unset:item.unset });
        console.log( 'Topics.update "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'topics.update',
                'Unable to update "'+o.name+'" topic' );
        }
        return ret;
    },
});
