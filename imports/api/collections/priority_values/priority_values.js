/*
 * Priority values: whether an action must or should be done
 */
import { Mongo } from 'meteor/mongo';

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
    deletable: {
        type: Boolean,
        optional: true
    },
    default: {
        type: Boolean,
        optional: true
    }
});
PriorityValues.attachSchema( PriorityValues.schema );

PriorityValues.attachBehaviour( 'timestampable', {
    createdBy: false,
    updatedBy: false
});

PriorityValues.helpers({
    isDefault: function(){
        return this.default === undefined ? false : this.default;
    },
    isDeletable: function(){
        return this.deletable === undefined ? true : this.deletable;
    }
});

PriorityValues.fn = {
    check: function( id, obj ){
        PriorityValues.schema.validate( obj );
        return PriorityValues.fn.checkName( id, obj );
    },
    checkName: function( id, obj ){
        const exists = PriorityValues.findOne({ name: obj.name });
        if( exists && ( !id || exists._id !== id )){
            const error = {
                type: 'dupname',
                message: 'A priority value with this same name already exists with id='+exists._id
            };
            if( Meteor.isClient ){
                throw( error );
            }
            console.log( error.message );
            return error.type;
        }
        return undefined;
    },
    equal: function( a,b ){
        return
            ( a.name === b.name ) &&
            ( a.calendar === b.calendar ) &&
            ( a.deletable === b.deletable );
    }
};
