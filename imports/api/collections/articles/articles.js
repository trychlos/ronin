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
    if( !Articles.fn.types.includes( o.type )){
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

// returns an object which contains all *set* fields
Articles.fn.cleanup = function( o ){
    let _set = ( dest, src, name ) => {
        if( src[name] ){
            dest[name] = src[name];
        }
    };
    let ret = { type: o.type };
    _set( ret, o, 'name' );
    _set( ret, o, 'topic' );
    _set( ret, o, 'description' );
    o.userId = null;
    if( Meteor.isServer ){
        o.userId = this.userId;
    }
    if( Meteor.isClient ){
        o.userId = Meteor.userId();
    }
    _set( ret, o, 'userId' );
    // seems that we do not manage ourselves the userId
    //console.log( o );
    //console.log( ret );
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
    let _equals = ( f, g ) => {
        if( !f && !g ){
            return true;
        }
        const ret = (( f && !g ) || ( !f && g ) || ( f === g ));
        if( !ret ){
            console.log( '"'+f+'" !== "'+g+'"' );
        }
        return ret;
    };
    let ret = _equals( a.type, b.type ) &&
        _equals( a.name, b.name ) &&
        _equals( a.description, b.description ) &&
        _equals( a.topic, b.topic );
    if( ret ){
        switch( a.type ){
            case 'A':
                ret = _equals( a.notes, b.notes ) &&
                        _equals( a.startDate, b.startDate ) &&
                        _equals( a.dueDate, b.dueDate ) &&
                        _equals( a.doneDate, b.doneDate ) &&
                        _equals( a.parent, b.parent ) &&
                        _equals( a.status, b.status ) &&
                        _equals( a.outcome, b.outcome );
                break;
            case 'M':
                break;
            case 'P':
                    ret = _equals( a.notes, b.notes ) &&
                    _equals( a.startDate, b.startDate ) &&
                    _equals( a.dueDate, b.dueDate ) &&
                    _equals( a.doneDate, b.doneDate ) &&
                    _equals( a.parent, b.parent ) &&
                    _equals( a.future, b.future ) &&
                    _equals( a.vision, b.vision ) &&
                    _equals( a.brainstorm, b.brainstorm );
            break;
        }
    }
    return ret;
};
