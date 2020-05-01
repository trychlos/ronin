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
        let ret = { set:{ type: o.type }, unset:{}};
        soSet( ret, o, 'name' );
        soSet( ret, o, 'description' );
        soSet( ret, o, 'textColor' );
        soSet( ret, o, 'backgroundColor' );
        soSet( ret, o, 'userId' );
        // makes sure unset is not empty
        if( !ret.unset.length ){
            ret.unset['xxxxxx'] = '';
        }
        return ret;
    }
}
