/*
 *  Server side:
 *      throw new Meteor.Error( errorTypeStr, errorMessageStr );
 *
 *  Received on client side:
 *      Meteor.call( methodStr, methodParms, ( error, result ) => {
 *                  if( error ){
 *                      console.log( error );
 *                      throwError( error );
 *                      return false;
 *                  }
 *                  console.log( 'result='+result );
 *      };
 *
 *  where 'error' = {
 *      error: errorTypeStr,
 *      errorType: 'Meteor.Error',
 *      message: errorMessageStr [errorMYpeStr]
 *      reason: errorMessageStr
 *      details: undefined
 *  }
 */
import { Meteor } from 'meteor/meteor';
import { Articles } from '../articles.js';

/*
 * See https://guide.meteor.com/methods.html
 * and https://docs.meteor.com/api/methods.html
 *
 * Only write here remote procedures callable from the client.
 * Keep in Articles.sofns server-only functions.
 */
Meteor.methods({
    // insert a new action
    //  the new action is owned by the currently logged-in user
    'actions.insert'( o ){
        Articles.fn.check( o );
        Articles.fn.takeOwnership( o );
        Articles.sofns.doneConsistent( o );
        const item = Articles.sofns.cleanup( o );
        const ret = Articles.insert( item.set );
        console.log( 'Articles.actions.insert "'+o.name+'" returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.actions.insert',
                'Unable to insert "'+o.name+'" action' );
        }
        return ret;
    },

    // update an existing action
    //  or transform a thought into an action
    //  update does not mean taking ownership
    'actions.update'( o ){
        //console.log( o );
        Articles.fn.check( o );
        Articles.fn.takeOwnership( o );
        Articles.sofns.doneConsistent( o );
        const item = Articles.sofns.cleanup( o );
        const ret = Articles.update( o._id, { $set:item.set, $unset:item.unset });
        console.log( 'Articles.actions.update "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.actions.update',
                'Unable to update "'+o.name+'" action' );
        }
        return ret;
    },

    // delete an article
    //  children are updated to a null/none parent
    'articles.remove'( o ){
        Articles.fn.check_editable( o );
        let ret = Articles.remove( o._id );
        console.log( 'Articles.remove "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.remove',
                'Unable to remove "'+o.name+'" item' );
        }
        ret = Articles.update({ parent:o._id }, { $unset: { parent:'' }});
        console.log( 'Articles.update.children "'+o.name+'" ('+o._id+') returns '+ret );
        return ret;
    },

    // insert a new project
    //  the new project is owned by the currently logged-in user
    'projects.insert'( o ){
        Articles.fn.check( o );
        Articles.fn.takeOwnership( o );
        const item = Articles.sofns.cleanup( o );
        const ret = Articles.insert( item.set );
        console.log( 'Articles.projects.insert "'+o.name+'" returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.projects.insert',
                'Unable to insert "'+o.name+'" project' );
        }
        return ret;
    },

    // update an existing project
    //  update does not mean taking ownership
    'projects.update'( o ){
        Articles.fn.check( o );
        Articles.fn.takeOwnership( o );
        const item = Articles.sofns.cleanup( o );
        //console.log( item );
        const ret = Articles.update( o._id, { $set:item.set, $unset:item.unset });
        console.log( 'Articles.projects.update "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.projects.update',
                'Unable to update "'+o.name+'" project' );
        }
        return ret;
    },

    // insert returns the newly insert '_id' or throws an exception
    //  the new thought is owned by the currently logged-in user
    'thoughts.insert'( o ){
        Articles.fn.check( o );
        Articles.fn.takeOwnership( o );
        const item = Articles.sofns.cleanup( o );
        const ret = Articles.insert( item.set );
        console.log( 'Articles.thoughts.insert "'+o.name+'" returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.thoughts.insert',
                'Unable to insert "'+o.name+'" thought' );
        }
        return ret;
    },

    // update returns true or throws an exception
    'thoughts.update'( id, o ){
        Articles.fn.check( o );
        Articles.fn.takeOwnership( o );
        const item = Articles.sofns.cleanup( o );
        const ret = Articles.update( id, { $set:item.set, $unset:item.unset });
        console.log( 'Articles.thoughts.update "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.thoughts.update',
                'Unable to update "'+o.name+'" thought' );
        }
        return ret;
    }
});
