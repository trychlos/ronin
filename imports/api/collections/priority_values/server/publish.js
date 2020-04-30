import { Meteor } from 'meteor/meteor';
import { PriorityValues } from '../priority_values.js';

Meteor.publishTransformed( 'priority_values.all', function(){
    return PriorityValues.find().serverTransform({
        // add an 'objType' property to the PriorityValue document
        objType( self ){
            return R_OBJ_PRIORITY;
        },
        // add a 'useCount' property
        useCount( self ){
            return 0;
        }
    });
});
