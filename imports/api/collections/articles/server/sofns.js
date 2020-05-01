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
        let ret = { set:{ type: o.type }, unset:{}};
        soSet( ret, o, 'name' );
        soSet( ret, o, 'topic' );
        soSet( ret, o, 'description' );
        soSet( ret, o, 'userId' );
        switch( o.type ){
            case R_OBJ_ACTION:
                soSet( ret, o, 'notes' );
                soSet( ret, o, 'startDate' );
                soSet( ret, o, 'dueDate' );
                soSet( ret, o, 'doneDate' );
                soSet( ret, o, 'parent' );
                soSet( ret, o, 'status' );
                soSet( ret, o, 'last_status' );
                soSet( ret, o, 'context' );
                soSet( ret, o, 'outcome' );
                break;
            case R_OBJ_MAYBE:
                break;
            case R_OBJ_PROJECT:
                soSet( ret, o, 'notes' );
                soSet( ret, o, 'startDate' );
                soSet( ret, o, 'dueDate' );
                soSet( ret, o, 'doneDate' );
                soSet( ret, o, 'parent' );
                soSet( ret, o, 'future' );
                soSet( ret, o, 'vision' );
                soSet( ret, o, 'brainstorm' );
                break;
            case R_OBJ_THOUGHT:
                break;
        }
        // makes sure unset is not empty
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
