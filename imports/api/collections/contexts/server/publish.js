import { Meteor } from 'meteor/meteor';
import { Articles } from '/imports/api/collections/articles/articles.js';
import { Contexts } from '../contexts.js';

Meteor.publishTransformed( 'contexts.all', function(){
    return Contexts.find().serverTransform({
        // add an 'objType' property
        objType( self ){
            return R_OBJ_CONTEXT;
        },
        // add a 'useCount' property
        useCount( self ){
            const count = Articles.find({ type:'A', context:self._id }).count();
            return count;
        }
    });
});
