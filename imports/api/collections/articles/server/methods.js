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
 * Keep in Articles.server server-only functions.
 */
Meteor.methods({
    // action is said undone (back from done)
    //  must be called from Articles.fn.doneToggle()
    //  update does not mean taking ownership
    'actions.done.clear'( o ){
        Articles.fn.check( o );
        Articles.fn.takeOwnership( o );
        const ret = Articles.update( o._id, {
            $set: { status: o.status },
            $unset: { doneDate: '' }
        });
        console.log( 'Articles.actions.done.clear "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.actions.done.clear',
                'Unable to update "'+o.name+'" action to undone' );
        }
        return ret;
    },

    // action is said done
    //  must be called from Articles.fn.doneToggle()
    //  update does not mean taking ownership
    'actions.done.set'( o ){
        Articles.fn.check( o );
        Articles.fn.takeOwnership( o );
        const ret = Articles.update( o._id, { $set: {
            doneDate: o.doneDate,
            status: o.status,
            last_status: o.last_status
        }});
        console.log( 'Articles.actions.done.set "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.actions.done.set',
                'Unable to update "'+o.name+'" action to done' );
        }
        return ret;
    },

    // insert a new action
    //  the new action is owned by the currently logged-in user
    'actions.insert'( o ){
        Articles.fn.check( o );
        Articles.fn.takeOwnership( o );
        Articles.sofns.actionConsistentDone( o );
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
        Articles.sofns.actionConsistentDone( o );
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

    // takes ownership of the article
    //  only applies to thoughts in development phase
    'articles.ownership'( o ){
        Articles.fn.check( o );
        Articles.fn.takeOwnership( o );
        const item = Articles.sofns.cleanup( o );
        const ret = Articles.update( o._id, { $set:item.set, $unset:item.unset });
        console.log( 'Articles.ownership "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.ownership',
                'Unable to take ownership of the "'+o.name+'" article' );
        }
        return ret;
    },

    // delete an article
    //  children are updated to a null/none parent
    'articles.remove'( o ){
        Articles.sofns.stopIfNotEditable( o );
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

    // change the parent of an action or a project
    'articles.reparent'( o ){
        let ret = false;
        Articles.fn.check( o.item );
        Articles.fn.takeOwnership( o.item );
        if( o.parent && Articles.findOne({ _id:o.parent, type:'P' })){
            ret = Articles.update( o.item._id, { $set: {
                parent: o.parent
            }});
        } else {
            ret = Articles.update( o.item._id, { $unset: { parent: '' }});
        }
        console.log( 'Articles.reparent "'+o.name+'" ('+o._id+') returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.reparent',
                'Unable to reparent "'+o.item.name+'" article' );
        }
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
