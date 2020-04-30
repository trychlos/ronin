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
import { csfns } from '/imports/startup/both/collections-csfns.js';

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
    _id: {
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

/*
 * Consistently update the done fields of an action
 *  - if action is done, check that the two fields are consistent
 */
Articles.fn.actionDoneClear = function( o ){
    o.doneDate = null;
    if( o.status === 'don' ){
        o.status = o.last_status && o.last_status !== 'don' ? o.last_status : 'ina';
    }
};
Articles.fn.actionDoneSet = function( o ){
    if( o.status !== 'don' ){
        o.last_status = o.status;
    }
    o.status = 'don';
    if( !o.doneDate ){
        o.doneDate = new Date();
    }
};

/* Check for the intrinsic validity of an article, whether it be a thought, an
 *  action, a project or a maybe.
 *  Doesn't modify the provided object.
 *  Doesn't return any value, but throws a Meteor.Error if needed.
 */
Articles.fn.check = function( o ){
    csfns.check_object( o );
    Articles.fn.check_type( o );
    csfns.check_editable( o );
    csfns.check_name( o );
    csfns.check_topic( o );

    // plus item dependancies
    switch( o.type ){
        case 'T':
            break;
        case 'A':
            csfns.check_status( o );
            // if parent set, must be an existing project
            // if context set, must be referenced in contexts collection
            break;
        case 'M':
            break;
        case 'P':
            // if parent set, must be an existing project
            // if parent set, the parent hierarchy must not loop and only contain projects
            break;
    }
    Articles.schema.validate( o );
};

// type must be known
Articles.fn.check_type = function( o ){
    if( !Articles.fn.types.includes( o.type )){
        throw new Meteor.Error(
            'type.invalid',
            'Type is not valid, found "'+o.type+'", allowed values: ['+Articles.fn.types.join( ',' )+']'
        );
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
    //console.log( a );
    //console.log( b );
    let ret = csfns.equalStrs( a.type, b.type ) &&
        csfns.equalStrs( a.name, b.name ) &&
        csfns.equalStrs( a.description, b.description ) &&
        csfns.equalStrs( a.topic, b.topic );
    if( ret ){
        switch( a.type ){
            case 'A':
                ret = csfns.equalStrs( a.notes, b.notes ) &&
                        csfns.equalDates( a.startDate, b.startDate ) &&
                        csfns.equalDates( a.dueDate, b.dueDate ) &&
                        csfns.equalDates( a.doneDate, b.doneDate ) &&
                        csfns.equalStrs( a.parent, b.parent ) &&
                        csfns.equalStrs( a.status, b.status ) &&
                        csfns.equalStrs( a.outcome, b.outcome );
                break;
            case 'M':
                break;
            case 'P':
                ret = csfns.equalStrs( a.notes, b.notes ) &&
                        csfns.equalDates( a.startDate, b.startDate ) &&
                        csfns.equalDates( a.dueDate, b.dueDate ) &&
                        csfns.equalDates( a.doneDate, b.doneDate ) &&
                        csfns.equalStrs( a.parent, b.parent ) &&
                        csfns.equalStrs( a.future, b.future ) &&
                        csfns.equalStrs( a.vision, b.vision ) &&
                        csfns.equalStrs( a.brainstorm, b.brainstorm );
            break;
        }
    }
    return ret;
};

Articles.fn.gtdEdit = {
    A: 'gtd-review-actions-edit',
    M: null,
    P: 'gtd-review-projects-edit',
    T: 'gtd-collect-thought-edit'
};

Articles.helpers({
    // transform a thought into an action
    actionAction(){
        let action = null;
        if( this.type === R_OBJ_THOUGHT ){
            action = new Ronin.ActionEx({
                type: R_OBJ_ACTION,
                action: R_ACT_NEW,
                gtd: 'gtd-process-to-action',
                item: this
            });
            action.activable( true );
        }
        return action;
    },
    // delete an article (action, maybe, project or thought)
    deleteAction(){
        const action = new Ronin.ActionEx({
            type: this.type,
            action: R_ACT_DELETE,
            gtd: 'gtd-article-delete',
            item: this
        });
        action.activable( true );
        return action;
    },
    // edit an article (action, maybe, project or thought)
    editAction(){
        const action = new Ronin.ActionEx({
            type: this.type,
            action: R_ACT_EDIT,
            gtd: Articles.fn.gtdEdit[this.type],
            item: this
        });
        action.activable( true );
        return action;
    },
    // transform a thought or an action into a project
    projectAction(){
        let action = null;
        if( this.type === R_OBJ_THOUGHT || this.type === R_OBJ_ACTION ){
            action = new Ronin.ActionEx({
                type: R_OBJ_PROJECT,
                action: R_ACT_NEW,
                gtd: 'gtd-process-to-project',
                item: this
            });
            action.activable( true );
        }
        return action;
    }
});
