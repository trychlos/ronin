/*
 *  server/sofns.js:
 *  server-only functions
 */
import { Meteor } from 'meteor/meteor';
import { Articles } from '../articles.js';

Articles.sofns = {
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
        _set( ret, o, 'topic' );
        _set( ret, o, 'description' );
        _set( ret, o, 'userId' );
        switch( o.type ){
            case 'A':
                _set( ret, o, 'notes' );
                _set( ret, o, 'startDate' );
                _set( ret, o, 'dueDate' );
                _set( ret, o, 'doneDate' );
                _set( ret, o, 'parent' );
                _set( ret, o, 'status' );
                _set( ret, o, 'last_status' );
                _set( ret, o, 'context' );
                _set( ret, o, 'outcome' );
                break;
            case 'M':
                break;
            case 'P':
                _set( ret, o, 'notes' );
                _set( ret, o, 'startDate' );
                _set( ret, o, 'dueDate' );
                _set( ret, o, 'doneDate' );
                _set( ret, o, 'parent' );
                _set( ret, o, 'future' );
                _set( ret, o, 'vision' );
                _set( ret, o, 'brainstorm' );
                break;
            case 'T':
                break;
        }
        // makes sure neither set nor unset are empty
        if( !ret.set.length ){
            ret.set['name'] = o.name;
        }
        if( !ret.unset.length ){
            ret.unset['xxxxxx'] = '';
        }
        return ret;
    },
    /*
     * Make sure the 'done' attributes are consistent before updating an action
     *  - status = 'don' and doneDate is set
     *  - status != 'don' and doneDate is cleared
     */
    doneConsistent( o ){
        if( o.doneDate || o.status === 'don' ){
            Articles.fn.actionDoneSet( o );
        } else {
            Articles.fn.actionDoneClear( o );
        }
    }
}
