import { Mongo } from 'meteor/mongo';

export const TimeValues = new Mongo.Collection('time_values');

TimeValues.schema = new SimpleSchema({
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
TimeValues.attachSchema( TimeValues.schema );

TimeValues.attachBehaviour( 'timestampable', {
    createdBy: false,
    updatedBy: false
});

TimeValues.helpers({
    isDefault: function(){
        return this.default === undefined ? false : this.default;
    },
    isDeletable: function(){
        return this.deletable === undefined ? true : this.deletable;
    }
});

TimeValues.fn = {
    check: function( id, obj ){
        TimeValues.schema.validate( obj );
        return TimeValues.fn.checkName( id, obj );
    },
    checkName: function( id, obj ){
        const exists = TimeValues.findOne({ name: obj.name });
        if( exists && ( !id || exists._id !== id )){
            const error = {
                type: 'dupname',
                message: 'A time value with this same name already exists with id='+exists._id
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
