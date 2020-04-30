import { Meteor } from 'meteor/meteor';
import { Delegates } from '../delegates.js';

Meteor.publishTransformed( 'delegates.all', function(){
    return Delegates.find().serverTransform({
        // add an 'objType' property to the Delegate document
        objType( self ){
            return R_OBJ_DELEGATE;
        },
        // add a 'useCount' property
        useCount( self ){
            return 0;
        }
    });
});
