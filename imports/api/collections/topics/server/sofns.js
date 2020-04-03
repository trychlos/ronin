/*
 *  server/sofns.js:
 *  server-only functions
 */
import { Meteor } from 'meteor/meteor';
import { Articles } from '/imports/api/collections/articles/articles.js';
import { Topics } from '../topics.js';

Topics.sofns = {
    /*
     * Returns an object which contains:
     *  - a 'set' collection with all *set* fields
     *  - an 'unset' collection with all *unset* fields
     *  This is only used on the server before every insert/update, to make sure
     *  only actually  used fields are written in Mongo collections.
     *  Doesn't modify the provided object.
     *  May throw a Meteor.Error exception if object type is unknown (which should
     *  have already been caught by check() function above).
     */
    cleanup( o ){
        const _set = ( dest, src, name ) => {
            if( src[name] && src[name] !== 'none' ){
                dest.set[name] = src[name];
            } else {
                dest.unset[name] = '';
            }
        };
        let ret = { set:{ type: o.type }, unset:{}};
        _set( ret, o, 'name' );
        _set( ret, o, 'description' );
        _set( ret, o, 'textColor' );
        _set( ret, o, 'backgroundColor' );
        _set( ret, o, 'userId' );
        // makes sure neither set nor unset are empty
        if( !ret.set.length ){
            ret.set['name'] = o.name;
        }
        if( !ret.unset.length ){
            ret.unset['xxxxxx'] = '';
        }
        return ret;
    }
}

Topics.serverTransform({
    // add a 'useCount' property to the Topic document
    useCount( self ) {
        const count = Articles.find({ topic:self._id }).count();
        return count;
    }
});
