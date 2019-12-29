import { Mongo } from 'meteor/mongo';

export const EnergyValues = new Mongo.Collection('energy_values');

EnergyValues.schema = new SimpleSchema({
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
EnergyValues.attachSchema( EnergyValues.schema );

EnergyValues.attachBehaviour( 'timestampable', {
    createdBy: false,
    updatedBy: false
});

EnergyValues.helpers({
    isDefault: function(){
        return this.default === undefined ? false : this.default;
    },
    isDeletable: function(){
        return this.deletable === undefined ? true : this.deletable;
    }
});

EnergyValues.fn = {
    check: function( id, obj ){
        EnergyValues.schema.validate( obj );
        return EnergyValues.fn.checkName( id, obj );
    },
    checkName: function( id, obj ){
        const exists = EnergyValues.findOne({ name: obj.name });
        if( exists && ( !id || exists._id !== id )){
            const error = {
                type: 'dupname',
                message: 'An energy value with this same name already exists with id='+exists._id
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
