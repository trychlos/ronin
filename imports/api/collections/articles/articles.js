/*
 * 'articles' collection.
 *
 *  This collection merges both:
 *  - thoughts
 *  - actions
 *  - projects
 *  - maybe
 *  into a single collection for MongoDB efficiency reasons.
 *
 *  +-----------------+-----------------------+-----------------------+-----------------------+-----------------------+
 *  |                 | thought               | action                | project               | maybe                 |
 *  +-----------------+-----------------------+-----------------------+-----------------------+-----------------------+
 *  | type            | constant='T'          | constant='A'          | constant='P'          | constant='M'          |
 *  +-----------------+-----------------------+-----------------------+-----------------------+-----------------------+
 *  | name            | mandatory             | mandatory             | mandatory             | mandatory             |
 *  |                 | no default            | no default            | no default            | no default            |
 *  +-----------------+-----------------------+-----------------------+-----------------------+-----------------------+
 *  | topic           | opt                   | opt                   | opt                   | opt                   |                      |
 *  |                 | no default            | no default            | no default            | no default            |
 *  |                 | displayed as 'None'   | displayed as 'None'   | displayed as 'None'   | displayed as 'None'   |
 *  +-----------------+-----------------------+-----------------------+-----------------------+-----------------------+
 *  | description     | opt                   | opt                   | opt                   | opt                   |
 *  |                 | no default            | no default            | no default            | no default            |
 *  +-----------------+-----------------------+-----------------------+-----------------------+-----------------------+
 *  | userId          | opt                   | opt                   | opt                   | opt                   |
 *  |                 | no default            | no default            | no default            | no default            |
 *  +-----------------+-----------------------+-----------------------+-----------------------+-----------------------+
 *  | notes           |                       | opt                   | opt                   |                       |
 *  |                 |                       | no default            | no default            |                       |
 *  +-----------------+-----------------------+-----------------------+-----------------------+-----------------------+
 *  | startDate       |                       | opt                   | opt                   |                       |
 *  |                 |                       | no default            | no default            |                       |
 *  +-----------------+-----------------------+-----------------------+-----------------------+-----------------------+
 *  | dueDate         |                       | opt                   | opt                   |                       |
 *  |                 |                       | no default            | no default            |                       |
 *  +-----------------+-----------------------+-----------------------+-----------------------+-----------------------+
 *  | doneDate        |                       | opt                   | opt                   |                       |
 *  |                 |                       | no default            | no default            |                       |
 *  +-----------------+-----------------------+-----------------------+-----------------------+-----------------------+
 *  | parent          |                       | opt                   | opt                   |                       |
 *  |                 |                       | no default            | no default            |                       |
 *  +-----------------+-----------------------+-----------------------+-----------------------+-----------------------+
 *  | status          |                       | mandatory             |                       |                       |
 *  |                 |                       | default='Inactive'    |                       |                       |
 *  +-----------------+-----------------------+-----------------------+-----------------------+-----------------------+
 *  | last_status (1) |                       | opt                   |                       |                       |
 *  |                 |                       | no default            |                       |                       |
 *  +-----------------+-----------------------+-----------------------+-----------------------+-----------------------+
 *  | context         |                       | opt                   |                       |                       |
 *  |                 |                       | default='None'        |                       |                       |
 *  +-----------------+-----------------------+-----------------------+-----------------------+-----------------------+
 *  | outcome         |                       | opt                   |                       |                       |
 *  |                 |                       | no default            |                       |                       |
 *  +-----------------+-----------------------+-----------------------+-----------------------+-----------------------+
 *  | future          |                       |                       | opt                   |                       |
 *  |                 |                       |                       | default=false         |                       |
 *  +-----------------+-----------------------+-----------------------+-----------------------+-----------------------+
 *  | vision          |                       |                       | opt                   |                       |
 *  |                 |                       |                       | no default            |                       |
 *  +-----------------+-----------------------+-----------------------+-----------------------+-----------------------+
 *  | brainstorm      |                       |                       | opt                   |                       |
 *  |                 |                       |                       | no default            |                       |
 *  +-----------------+-----------------------+-----------------------+-----------------------+-----------------------+
 *
 *  1. last_status of the action before done
 *      defaulting to inactive.
 */
import { Mongo } from 'meteor/mongo';

export const Articles = new Mongo.Collection( 'articles' );

Articles.fn = {
    types: [
        'T',    // thought
        'A',    // action
        'P',    // project
        'M'     // maybe
    ]
};

Articles.schema = new SimpleSchema({
    /* this is common to all articles
     * + thoughts only have these
     */
    type: {
        type: String,
        allowedValues: Articles.fn.types
    },
    name: {
        type: String
    },
    topic: {
        type: String,
        optional: true
    },
    description: {
        type: String,
        optional: true
    },
    userId: {
        type: String,
        optional: true
    },
    /* this is common to actions and projects
     */
    notes: {
        type: String,
        optional: true
    },
    startDate: {
        type: Date,
        optional: true
    },
    dueDate: {
        type: Date,
        optional: true
    },
    doneDate: {
        type: Date,
        optional: true
    },
    parent: {
        type: String,
        optional: true
    },
    /* actions-specific
     */
    status: {
        type: String,
        optional: true
    },
    last_status: {
        type: String,
        optional: true
    },
    context: {
        type: String,
        optional: true
    },
    outcome: {
        type: String,
        optional: true
    },
    /* projects-specific
     */
    future: {
        type: Boolean,
        optional: true
    },
    vision: {
        type: String,
        optional: true
    },
    brainstorm: {
        type: String,
        optional: true
    },
    xxxxxx: {   // unused key to be sure we always have something to unset
        type: String,
        optional: true
    }
});

Articles.attachSchema( Articles.schema );

Articles.attachBehaviour( 'timestampable', {
    createdBy: false,
    updatedBy: false
});

Articles.helpers({
    editableBy( userId ){
        // unknown or not logged-in user: no edit permission
        if( !userId ){
            return false;
        }
        // document is not attached to any user: anyone may edit it
        if( !this.userId ){
            return true;
        }
        return this.userId === userId;
    }
});

Articles.fn.check = function( id, o ){
    // type must be valid
    if( !o || !o.type || !Articles.fn.types.includes( o.type )){
        throw new Meteor.Error(
            'articles.invalid_type',
             o.type+': invalid type (permitted values are ['+Articles.fn.types.join(',')+']'
        );
    }
    // must have a name
    if( !o.name ){
        throw new Meteor.Error(
            'articles.empty_name',
            'mandatory name is empty'
        );
    }
    // must be editable by this user
    //  anyone may edit unowned documents
    let userId = null;
    if( Meteor.isServer ){
        userId = this.userId;
    }
    if( Meteor.isClient ){
        userId = Meteor.userId();
    }
    if( o.userId ){
        if( userId !== o.userId ){
            throw new Meteor.Error(
                'articles.unauthorized',
                'you are not allowed to edit this document'
            );
        }
    }
    // plus item dependancies
    switch( o.type ){
        case 'T':
            break;
        case 'A':
            break;
        case 'M':
            break;
        case 'P':
            break;
    }
};

// returns an object which contains:
//  - a 'set' collection with all *set* fields
//  - an 'unset' collection with all *unset* fields
Articles.fn.cleanup = function( o ){
    let _set = ( dest, src, name ) => {
        if( src[name] ){
            dest.set[name] = src[name];
        } else {
            dest.unset[name] = '';
        }
    };
    if( !o || !o.type || !Articles.fn.types.includes( o.type )){
        throw new Meteor.Error(
            'articles.invalid_type',
             o.type+': invalid type (permitted values are ['+Articles.fn.types.join(',')+']'
        );
    }
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
};

// Toggle action done status + update database
//  callable both from client and from server
Articles.fn.doneToggle = function( action ){
    if( action.doneDate ){
        action.doneDate = null;
        action.status = action.last_status ? action.last_status : 'ina';
        Meteor.call( '_actions.done.clear', action, ( e, res ) => {
            if( e ){
                throwError({ type:e.error, message: e.reason });
            }
        });
    } else {
        action.doneDate = new Date();
        action.last_status = action.status;
        action.status = 'don';
        Meteor.call( '_actions.done.set', action, ( e, res ) => {
            if( e ){
                throwError({ type:e.error, message: e.reason });
            }
        });
    }
};

// check if two objects are the same
// mainly used to prevent too many useless updates
Articles.fn.equal = function( a, b ){
    let _equalDates = ( c, d ) => {
        return _equals( c, d, ( e, f ) => {
            return moment( e ).isSame( f, 'day' );
        })
    };
    let _equalStrs = ( c, d ) => {
        return _equals( c, d, ( e, f ) => {
            return e === f;
        });
    };
    let _equals = ( c, d, cb ) => {
        let ret = true;
        if( c ){
            if( d ){
                ret = cb( c, d );
            } else {
                ret = false;
            }
        } else if( d ){
            ret = false;
        }
        if( !ret ){
            console.log( '"'+c+'" !== "'+d+'"' );
        }
        return ret;
    };
    //console.log( a );
    //console.log( b );
    let ret = _equalStrs( a.type, b.type ) &&
        _equalStrs( a.name, b.name ) &&
        _equalStrs( a.description, b.description ) &&
        _equalStrs( a.topic, b.topic );
    if( ret ){
        switch( a.type ){
            case 'A':
                ret = _equalStrs( a.notes, b.notes ) &&
                        _equalDates( a.startDate, b.startDate ) &&
                        _equalDates( a.dueDate, b.dueDate ) &&
                        _equalDates( a.doneDate, b.doneDate ) &&
                        _equalStrs( a.parent, b.parent ) &&
                        _equalStrs( a.status, b.status ) &&
                        _equalStrs( a.outcome, b.outcome );
                break;
            case 'M':
                break;
            case 'P':
                    ret = _equalStrs( a.notes, b.notes ) &&
                    _equalDates( a.startDate, b.startDate ) &&
                    _equalDates( a.dueDate, b.dueDate ) &&
                    _equalDates( a.doneDate, b.doneDate ) &&
                    _equalStrs( a.parent, b.parent ) &&
                    _equalStrs( a.future, b.future ) &&
                    _equalStrs( a.vision, b.vision ) &&
                    _equalStrs( a.brainstorm, b.brainstorm );
            break;
        }
    }
    return ret;
};
