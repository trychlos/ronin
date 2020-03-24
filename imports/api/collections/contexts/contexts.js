/*
 * Contexts
 *
 * This is the context into which an action is to be executed.
 *
 * As of v20.03.xx.x, contexts are common to each and every user.
 * Any logged-in user may create a new context, but only an admin (role to be
 * defined) could delete them.
 *
 * The user interface takes care of proposing a default 'None' context.
 */
import { Mongo } from 'meteor/mongo';

export const Contexts = new Mongo.Collection('contexts');

Contexts.schema = new SimpleSchema({
    name: {
        type: String
    },
    description: {
        type: String,
        optional: true
    }
});
Contexts.attachSchema( Contexts.schema );

Contexts.attachBehaviour( 'timestampable', {
    createdBy: false,
    updatedBy: false
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
        return true &&
            ( a.name === b.name ) &&
            ( a.description === b.description ) &&
            ( a.deletable === b.deletable );
    }
};
