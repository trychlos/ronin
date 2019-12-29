import { Mongo } from 'meteor/mongo';

export const Topics = new Mongo.Collection('topics');

Topics.schema = new SimpleSchema({
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
    textColor: {
        type: String,
        optional: true
    },
    backgroundColor: {
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
Topics.attachSchema( Topics.schema );

Topics.attachBehaviour( 'timestampable', {
    createdBy: false,
    updatedBy: false
});

Topics.helpers({
    isDefault: function(){
        return this.default === undefined ? false : this.default;
    },
    isDeletable: function(){
        return this.deletable === undefined ? true : this.deletable;
    }
});

Topics.fn = {
    check: function( id, obj ){
        Topics.schema.validate( obj );
        return Topics.fn.checkName( id, obj );
    },
    checkName: function( id, obj ){
        const exists = Topics.findOne({ name: obj.name });
        if( exists && ( !id || exists._id !== id )){
            const error = {
                type: 'dupname',
                message: 'A topic with this same name already exists with id='+exists._id
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
            ( a.textColor === b.textColor ) &&
            ( a.backgroundColor === b.backgroundColor ) &&
            ( a.deletable === b.deletable );
    }
};
