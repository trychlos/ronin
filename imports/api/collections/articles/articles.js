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
        console.log( 'Articles.helpers.editableBy()' );
    }
});

/*
 * Articles.fn are functions which may be called both from the client
 *  and on the server.
 *
 * See server/sofns.js for server-only functions.
 * See server/methods.js for server functions remotely callable from the client
 *  (aka Meteor RPC).
 */

/* Check for the intrinsic validity of an article, whether it be a thought, an
 *  action, a project or a maybe.
 *  Doesn't modify the provided object.
 *  Doesn't return any value, but throws a Meteor.Error if needed.
 */
Articles.fn.check = function( o ){
    Articles.fn.check_object( o );
    Articles.fn.check_type( o );
    Articles.fn.check_editable( o );
    Articles.fn.check_name( o );
    Articles.fn.check_topic( o );

    // plus item dependancies
    switch( o.type ){
        case 'T':
            break;
        case 'A':
            // if parent set, must be an existing project
            // status must be valid
            // if context set, must be referenced in contexts collection
            break;
        case 'M':
            break;
        case 'P':
            // if parent set, must be an existing project
            // if parent set, the parent hierarchy must not loop and only contain projects
            break;
    }
};

// must be editable by this user
//  anyone may edit an un-owned documents
Articles.fn.check_editable = function( o ){
    const currentUser = Meteor.userId();
    //console.log( 'check_editable: current.userId='+currentUser+' o.userId='+o.userId );
    if( o.userId ){
        if( currentUser !== o.userId ){
            throw new Meteor.Error(
                'unauthorized',
                'You are not allowed to edit this document'
            );
        }
    }
};

// name is mandatory
Articles.fn.check_name = function( o ){
    if( !o.name ){
        throw new ValidationError([{
            name: 'name',
            type: 'required',
            value: o.name,
            msg: 'mandatory name is empty'
        }]);
    }
};

// object must be defined
Articles.fn.check_object = function( o ){
    if( !o ){
        throw new Meteor.Error(
            'undefined',
            'object is not defined'
        );
    }
};

// topic must exist
Articles.fn.check_topic = function( o ){
    if( o.topic ){
    }
};

// type must be known
Articles.fn.check_type = function( o ){
    if( !Articles.fn.types.includes( o.type )){
        throw new ValidationError([{
            name: 'type',
            type:'invalid',
            value: o.type,
            allowed: Articles.fn.types,
            msg: 'permitted values: ['+Articles.fn.types.join(',')+']'
        }]);
    }
};

/* Test if two objects are equals
 *  mainly used to prevent too many useless updates
 *  Callable both from client and server, but mainly used from the client.
 *  Doesn't modify any object.
 *  Doesn't throw any exception, but returns true (resp. false) if the provided
 *  objects are equal (resp. different).
 */
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
        //if( !ret ){
        //    console.log( '"'+c+'" !== "'+d+'"' );
        //}
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

// Rationale: if the article is not owned by anyone, then the currently logged-in
//  user may take ownership of it.
//  We have so four states:
//  - there is no user currently logged in: no ownership can be taken
//  - user already has ownership of the article: taking ownership is not relevant
//  - the article does not yet belong to anyone: ownership could be taken
//  - the article belongs to someone else: taking ownership is forbidden.
Articles.fn.takeableStatus = {
    'NOT': 'no user is logged-in; no ownership can be taken',
    'HAS': 'logged-in user already has ownserhip of the item',
    'CAN': 'item does not belong to anyone, ownership can be taken',
    'FOR': 'item belongs to someone else, taking ownship is forbidden'
};
Articles.fn.takeableGetStatus = function( item ){
    const current = Meteor.userId();
    if( !current ){
        return 'NOT';
    }
    if( item.userId === current ){
        return 'HAS';
    }
    return item.userId ? 'FOR' : 'CAN';
}
// This function is to be called at the business layer model level
//  Rationale: when updating an object, take ownership of it if the object
//  was still un-owned.
//  Throws an exception is ownership is not takeable here, which should have
//  been previously checked.
Articles.fn.takeOwnership = function( item ){
    let _throwsError = function(){
        throw new Meteor.Error(
            'code',
            'Ownership is not takeable here and there. Should have been prevented sooner'
        );
    }
    const currentId = Meteor.userId();
    if( currentId ){
        if( item.userId ){
            if( currentId !== item.userId ){
                // item is owned by someone else!
                _throwsError();
            }
        } else {
            item.userId = currentId;
        }
    } else if( item.userId ){
        // item is owned by somebody, but no one is currently logged-in
        _throwsError();
    }
}
