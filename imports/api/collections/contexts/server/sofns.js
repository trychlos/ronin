/*
 *  server/sofns.js:
 *  server-only functions
 */
import { Meteor } from 'meteor/meteor';
import { Contexts } from '../contexts.js';

Contexts.sofns = {
    /*
     * Returns an object which contains:
     *  - a 'set' hash with all *set* fields and their value
     *  - an 'unset' hash with all *unset* fields
     *  This is only used on the server before every insert/update, to make sure
     *  only actually  used fields are written in Mongo collections.
     *  Doesn't modify the provided object.
     *  May throw a Meteor.Error exception if object type is unknown (which should
     *  have already been caught by check() function above).
     */
    cleanup( o ){
        let ret = { set:{}, unset:{}};
        soSet( ret, o, 'name' );
        soSet( ret, o, 'description' );
        soSet( ret, o, 'userId' );
        // makes sure unset is not empty
        if( !ret.unset.length ){
            ret.unset['xxxxxx'] = '';
        }
        return ret;
    }
}
