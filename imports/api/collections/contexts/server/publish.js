import { Meteor } from 'meteor/meteor';
import { Articles } from '/imports/api/collections/articles/articles.js';
import { Contexts } from '../contexts.js';

Meteor.publishTransformed( 'contexts.all', function(){
    return Contexts.find().serverTransform({
        // add a 'st_deleteArgs' property to the Context document
        //  this is the Ronin.ActionEx constructor argument
        st_deleteArgs( self ){
            return {
                type: self.st_objType,
                action: R_ACT_DELETE,
                gtd: 'gtd-setup-context-delete'
            };
        },
        // add an 'st_editArgs' property
        st_editArgs( self ){
            return {
                type: self.st_objType,
                action: R_ACT_EDIT,
                gtd: 'gtd-setup-context-edit'
            };
        },
        // add an 'st_objType' property
        st_objType( self ){
            return R_OBJ_CONTEXT;
        },
        // add a 'st_useCount' property
        st_useCount( self ){
            const count = Articles.find({ type:'A', context:self._id }).count();
            return count;
        }
    });
});
