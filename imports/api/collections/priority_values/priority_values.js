/*
 * Priority values: whether an action must or should be done
 */
import { Mongo } from 'meteor/mongo';
import { csfns } from '/imports/startup/both/collections-csfns.js';

export const PriorityValues = new Mongo.Collection('priority_values');

PriorityValues.schema = new SimpleSchema({
    name: {
        type: String,
    },
    calendar: {
        type: SimpleSchema.Integer,
        optional: true,
        min: 0
    },
    description: {
        type: String,
        optional: true
    },
    userId: {
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
PriorityValues.attachSchema( PriorityValues.schema );

PriorityValues.attachBehaviour( 'timestampable', {
    createdBy: false,
    updatedBy: false
});

/*
 * PriorityValues.fn are functions which may be called both from the client
 *  and on the server.
 *
 * See server/sofns.js for server-only functions.
 * See server/methods.js for server functions remotely callable from the client
 *  (aka Meteor RPC).
 */
PriorityValues.fn = {
    check: function( o ){
        csfns.check_object( o );
        csfns.check_editable( o );
        csfns.check_name( o );
        PriorityValues.schema.validate( o );
    },
    /* Test if two objects are equals
    *  mainly used to prevent too many useless updates
    *  Callable both from client and server, but mainly used from the client.
    *  Doesn't modify any object.
    *  Doesn't throw any exception, but returns true (resp. false) if the provided
    *  objects are equal (resp. different).
    */
    equal: function( a, b ){
        return csfns.equalStrs( a.name, b.name ) &&
                csfns.equalStrs( a.description, b.description );
    }
};

PriorityValues.newAction = new Ronin.ActionEx({
    type: R_OBJ_PRIORITY,
    action: R_ACT_NEW,
    gtd: 'gtd-setup-priority-new'
});

PriorityValues.helpers({
    deleteAction(){
        const action = new Ronin.ActionEx({
            type: this.objType,
            action: R_ACT_DELETE,
            gtd: 'gtd-setup-priority-delete',
            item: this
        });
        action.activable( !Boolean( this.useCount ));
        return action;
    },
    editAction(){
        const action = new Ronin.ActionEx({
            type: this.objType,
            action: R_ACT_EDIT,
            gtd: 'gtd-setup-priority-edit',
            item: this
        });
        action.activable( true );
        return action;
    }
});
