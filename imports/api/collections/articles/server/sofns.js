/*
 *  server/sofns.js:
 *  server-only functions
 */
import { Meteor } from 'meteor/meteor';
import { Articles } from '../articles.js';

Articles.sofns = {
    /*
     * Consistently update the done fields of an action
     *  - if action is done, check that the two fields are consistent
     */
    actionConsistentDone( o ){
        if( o.doneDate || o.status === 'done'){
            o.status = 'don';
            if( !o.doneDate ){
                o.doneDate = new Date();
            }
        } else {
            o.doneDate = null;
            if( o.status === 'don' && o.last_status ){
                o.status = o.last_status;
            }
        }
    },
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
        let _set = ( dest, src, name ) => {
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
     * Checks that the currently logged-in user is able to update the 'it' object
     *  if user is not logged-in, only update un-owned objects
     *  if user is logged-in, can update un-owned + its own objects
     *  + try to take ownership if this later case
     */
    stopIfNotEditable( it ){
        let _throwsError = function(){
            throw new Meteor.Error(
                'code',
                'Ownership is not takeable here and there. Should have been prevented sooner'
            );
        }
        const currentId = Meteor.userId();
        if( it.userId ){
            if( !currentId || currentId !== it.userId ){
                _throwsError();
            }
        }
    },
}
