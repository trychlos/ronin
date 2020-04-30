import { Meteor } from 'meteor/meteor';
import { TimeValues } from '../time_values.js';

Meteor.publishTransformed( 'time_values.all', function(){
    return TimeValues.find().serverTransform({
        // add an 'objType' property to the TimeValue document
        objType( self ){
            return R_OBJ_TIME;
        },
        // add a 'useCount' property
        useCount( self ){
            return 0;
        }
    });
});
