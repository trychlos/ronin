import { Mongo } from 'meteor/mongo';

export const ActionStatus = new Mongo.Collection('action_status');

ActionStatus.schema = new SimpleSchema({
    code: {
        type: String,
        optional: true
    },
    name: {
        type: String,
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
ActionStatus.attachSchema( ActionStatus.schema );

ActionStatus.attachBehaviour( 'timestampable', {
    createdBy: false,
    updatedBy: false
});

ActionStatus.helpers({
    isDefault: function(){
        return this.default === undefined ? false : this.default;
    },
    isDeletable: function(){
        return this.deletable === undefined ? true : this.deletable;
    }
});

ActionStatus.fn = {
    check: function( id, obj ){
        ActionStatus.schema.validate( obj );
        return ActionStatus.fn.checkName( id, obj );
    },
    checkName: function( id, obj ){
        const exists = ActionStatus.findOne({ name: obj.name });
        if( exists && ( !id || exists._id !== id )){
            const error = {
                type: 'dupname',
                message: 'An action status with this same name already exists with id='+exists._id
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
            ( a.deletable === b.deletable );
    }
};
