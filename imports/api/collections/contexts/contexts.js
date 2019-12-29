import { Mongo } from 'meteor/mongo';

export const Contexts = new Mongo.Collection('contexts');

Contexts.schema = new SimpleSchema({
    code: {
        type: String,
        optional: true
    },
    name: {
        type: String
    },
    description: {
        type: String,
        optional: true
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
Contexts.attachSchema( Contexts.schema );

Contexts.attachBehaviour( 'timestampable', {
    createdBy: false,
    updatedBy: false
});

Contexts.helpers({
    isDefault: function(){
        return this.default === undefined ? false : this.default;
    },
    isDeletable: function(){
        return this.deletable === undefined ? true : this.deletable;
    }
});

Contexts.fn = {
    check: function( id, obj ){
        Contexts.schema.validate( obj );
        return Contexts.fn.checkName( id, obj );
    },
    checkName: function( id, obj ){
        const exists = Contexts.findOne({ name: obj.name });
        if( exists && ( !id || exists._id !== id )){
            const error = {
                type: 'dupname',
                message: 'A context with this same name already exists with id='+exists._id
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
            ( a.description === b.description ) &&
            ( a.deletable === b.deletable );
    }
};
