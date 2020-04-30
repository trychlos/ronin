import { Meteor } from 'meteor/meteor';
import { References } from '../references.js';

Meteor.publishTransformed( 'references.all', function(){
    return References.find().serverTransform({
        // add an 'objType' property to the Reference document
        objType( self ){
            return R_OBJ_REFERENCE;
        },
        // add a 'useCount' property
        useCount( self ){
            return 0;
        }
    });
});
