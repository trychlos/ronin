import { Meteor } from 'meteor/meteor';
import { Articles } from '/imports/api/collections/articles/articles.js';
import { Contexts } from '../contexts.js';

Meteor.publishTransformed( 'contexts.all', function(){
    return Contexts.find().serverTransform({
        // add an 'objType' property to the Context document
        objType( self ){
            return R_OBJ_CONTEXT;
        },
        // add a 'useCount' property
        useCount( self ){
            return Articles.find({ context:self._id }).count();
        }
    });
});
