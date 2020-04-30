import { Meteor } from 'meteor/meteor';
import { Topics } from '../topics.js';

Meteor.publishTransformed( 'topics.all', function(){
    return Topics.find().serverTransform({
        // add an 'objType' property to the Topic document
        objType( self ){
            return R_OBJ_TOPIC;
        },
        // add a 'useCount' property
        useCount( self ){
            return 0;
        }
    });
});
