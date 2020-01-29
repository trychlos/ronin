/*
 * 'articles' collection.
 *
 *  This collection merges both:
 *  - thoughts
 *  - actions
 *  - projects
 *  into a single collection for MongoDB efficiency reasons.
 *
 *  +----------------+-----------------------+-----------------------+-----------------------+
 *  |                | thought               | action                | project               |
 *  +----------------+-----------------------+-----------------------+-----------------------+
 *  | type           | constant='T'          | constant='A'          | constant='P'          |
 *  +----------------+-----------------------+-----------------------+-----------------------+
 *  | name           | mandatory             | mandatory             | mandatory             |
 *  |                | no default            | no default            | no default            |
 *  +----------------+-----------------------+-----------------------+-----------------------+
 *  | topic          | opt                   | opt                   | opt                   |
 *  |                | no default            | no default            | no default            |
 *  |                | displayed as 'None'   | displayed as 'None'   | displayed as 'None'   |
 *  +----------------+-----------------------+-----------------------+-----------------------+
 *  | description    | opt                   | opt                   | opt                   |
 *  |                | no default            | no default            | no default            |
 *  +----------------+-----------------------+-----------------------+-----------------------+
 *  | notes          |                       | opt                   | opt                   |
 *  |                |                       | no default            | no default            |
 *  +----------------+-----------------------+-----------------------+-----------------------+
 *  | startDate      |                       | opt                   | opt                   |
 *  |                |                       | no default            | no default            |
 *  +----------------+-----------------------+-----------------------+-----------------------+
 *  | dueDate        |                       | opt                   | opt                   |
 *  |                |                       | no default            | no default            |
 *  +----------------+-----------------------+-----------------------+-----------------------+
 *  | doneDate       |                       | opt                   | opt                   |
 *  |                |                       | no default            | no default            |
 *  +----------------+-----------------------+-----------------------+-----------------------+
 *  | parent         |                       | opt                   | opt                   |
 *  |                |                       | no default            | no default            |
 *  +----------------+-----------------------+-----------------------+-----------------------+
 *  | status (1)     |                       | mandatory             | opt                   |
 *  |                |                       | default='Inactive'    | no default            |
 *  +----------------+-----------------------+-----------------------+-----------------------+
 *  | context        |                       | opt                   |                       |
 *  |                |                       | default='None'        |                       |
 *  +----------------+-----------------------+-----------------------+-----------------------+
 *  | outcome        |                       | opt                   |                       |
 *  |                |                       | no default            |                       |
 *  +----------------+-----------------------+-----------------------+-----------------------+
 *  | vision         |                       |                       | opt                   |
 *  |                |                       |                       | no default            |
 *  +----------------+-----------------------+-----------------------+-----------------------+
 *  | brainstorm     |                       |                       | opt                   |
 *  |                |                       |                       | no default            |
 *  +----------------+-----------------------+-----------------------+-----------------------+
 *
 *  1. Action status is different from the project status:
 *      - action status is mandatory, taken from action_status limitative list
 *      - project status is optional, taken from project_status limitative list.
 */
import { Mongo } from 'meteor/mongo';

export const Articles = new Mongo.Collection( 'articles' );

Articles.fn = {
    types: [
        'T',
        'A',
        'P'
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
    status: {
        type: String,
        optional: true
    },
    /* actions-specific
     */
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
});

Articles.fn.check = function( id, o ){
    // type must be valid
    if( !Articles.fn.types.includes( o.type )){
        throw({ message:o.type+': invalid type (permitted values are ['+Articles.fn.types.join(',')+']' });
    }
    // must have a name
    if( !o.name ){
        throw({ message:'empty name' });
    }
    switch( o.type ){
        case 'T':
            break;
        case 'A':
            break;
        case 'P':
            break;
    }
};

// check if two objects are the same
// mainly used to prevent too many useless updates
Articles.fn.equal = function( a,b ){
    return
        ( a.name === b.name ) &&
        ( a.description === b.description ) &&
        ( a.topic === b.topic );
};
