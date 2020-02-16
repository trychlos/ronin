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

Meteor.methods({

    // checks that the specified 'it' object is of the expected 'type'
    _articles_check_type( it, type ){
        if( it.type !== type ){
            throw new Meteor.Error(
                'articles.invalid_type', art.type+': invalid type ("'+type+'" expected)'
            );
        }
    },

    // checks that the currently logged-in user is able to update the 'it' object
    //  if user is not logged-in, only update un-owned objects
    //  if user is logged-in, can update un-owned + its own objects
    _articles_check_user( it ){
        if( it.userId ){
            if( !this.userId || this.userId !== it.userId ){
                throw new Meteor.Error(
                    'articles.unauthorized', 'you are not authorized to update this item'
                );
            }
        }
    },

    // action is said undone (back from done)
    //  must be called from Articles.fn.doneToggle()
    //  update does not mean taking ownership
    '_actions.done.clear'( o ){
        Meteor.call( '_articles_check_type', o, 'A' );
        Meteor.call( '_articles_check_user', o );
        const ret = Articles.update( o._id, { $set: {
            doneDate: null,
            status: o.status
        }});
        console.log( 'Articles.actions.done.set("'+o.name+'") returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.actions.done.set', 'unable to update "'+o.name+'" action' );
        }
        return ret;
    },

    // action is said done
    //  must be called from Articles.fn.doneToggle()
    //  update does not mean taking ownership
    '_actions.done.set'( o ){
        Meteor.call( '_articles_check_type', o, 'A' );
        Meteor.call( '_articles_check_user', o );
        const ret = Articles.update( o._id, { $set: {
            doneDate: o.doneDate,
            status: o.status,
            last_status: o.last_status
        }});
        console.log( 'Articles.actions.done.set("'+o.name+'") returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.actions.done.set',
                'unable to update "'+o.name+'" action' );
        }
        return ret;
    },

    // insert a new action
    //  the new action is owned by the currently logged-in user
    'actions.insert'( o ){
        Meteor.call( '_articles_check_type', o, 'A' );
        Meteor.call( '_articles_check_user', o );
        const ret = Articles.insert({
            type: o.type,
            name: o.name,
            topic: o.topic,
            description: o.description,
            userId: this.userId,
            notes: o.notes,
            startDate: o.startDate,
            dueDate: o.dueDate,
            doneDate: o.doneDate,
            parent: o.parent,
            status: o.status,
            context: o.context,
            outcome: o.outcome
        });
        console.log( 'Articles.actions.insert("'+o.name+'") returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.actions.insert',
                'unable to insert "'+o.name+'" action' );
        }
        return ret;
    },

    // delete an action
    'actions.remove'( o ){
        Meteor.call( '_articles_check_type', o, 'A' );
        Meteor.call( '_articles_check_user', o );
        console.log( 'articles.actions.remove name='+o.name );
        Articles.remove( o._id );
    },

    // update an existing action
    //  or transform a thought into an action
    //  update does not mean taking ownership
    'actions.update'( id, o ){
        Meteor.call( '_articles_check_type', o, 'A' );
        Meteor.call( '_articles_check_user', o );
        const ret = Articles.update( id, { $set: {
            type: o.type,
            name: o.name,
            topic: o.topic,
            description: o.description,
            userId: this.userId,
            notes: o.notes,
            startDate: o.startDate,
            dueDate: o.dueDate,
            doneDate: o.doneDate,
            parent: o.parent,
            status: o.status,
            context: o.context,
            outcome: o.outcome
        }});
        console.log( 'Articles.actions.update("'+o.name+'") returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.actions.update', 'unable to update "'+o.name+'" action' );
        }
        return ret;
    },

    // takes ownership of the article
    //  only applies to thoughts in development phase
    'articles.ownership'( o ){
        Meteor.call( '_articles_check_type', o, 'T' );
        Meteor.call( '_articles_check_user', o );
        if( o.userId ){
            throw new Meteor.Error(
                'articles.ownership', 'article is already owned by a user'
            );
        }
        if( !this.userId ){
            throw new Meteor.Error(
                'articles.ownership', 'user must be logged-in'
            );
        }
        const ret = Articles.update( o._id, { $set: { userId: this.userId }});
        console.log( 'Articles.ownership("'+o.name+'") returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.ownership',
                'unable to take ownership of the "'+o.name+'" article' );
        }
        return ret;
    },

    // change the parent of an action or a project
    //  update does not mean taking ownership
    'articles.reparent'( o_id, parent_id ){
        const ret = Articles.update( o_id, { $set: {
            parent: parent_id
        }});
        console.log( 'Articles.reparent("'+o_id+'") returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.reparent',
                'unable to reparent "'+o_id+'" article' );
        }
        return ret;
    },

    // insert a new project
    //  the new project is owned by the currently logged-in user
    'projects.insert'( o ){
        Meteor.call( '_articles_check_type', o, 'P' );
        Meteor.call( '_articles_check_user', o );
        const ret = Articles.insert({
            type: o.type,
            name: o.name,
            topic: o.topic,
            description: o.description,
            userId: this.userId,
            notes: o.notes,
            startDate: o.startDate,
            dueDate: o.dueDate,
            doneDate: o.doneDate,
            parent: o.parent,
            future: o.future,
            vision: o.vision,
            brainstorm: o.brainstorm
        });
        console.log( 'Articles.projects.insert("'+o.name+'") returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.projects.insert',
                'unable to insert "'+o.name+'" project' );
        }
        return ret;
    },

    // delete a project
    'projects.remove'( o ){
        Meteor.call( '_articles_check_type', o, 'P' );
        Meteor.call( '_articles_check_user', o );
        console.log( 'articles.projects.remove name='+o.name );
        Articles.remove( o._id );
    },

    // update an existing project
    //  update does not mean taking ownership
    'projects.update'( id, o ){
        Meteor.call( '_articles_check_type', o, 'P' );
        Meteor.call( '_articles_check_user', o );
        const ret = Articles.update( id, { $set: {
            name: o.name,
            topic: o.topic,
            description: o.description,
            notes: o.notes,
            startDate: o.startDate,
            dueDate: o.dueDate,
            doneDate: o.doneDate,
            parent: o.parent,
            future: o.future,
            vision: o.vision,
            brainstorm: o.brainstorm
        }});
        console.log( 'Articles.projects.update("'+o.name+'") returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.projects.update', 'unable to update "'+o.name+'" project' );
        }
        return ret;
    },

    // insert returns the newly insert '_id' or throws an exception
    //  the new thought is owned by the currently logged-in user
    'thoughts.insert'( o ){
        Meteor.call( '_articles_check_type', o, 'T' );
        Meteor.call( '_articles_check_user', o );
        const ret = Articles.insert({
            type: o.type,
            name: o.name,
            topic: o.topic,
            description: o.description,
            userId: this.userId
        });
        console.log( 'Articles.thoughts.insert("'+o.name+'") returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.thoughts.insert',
                'unable to insert "'+o.name+'" thought' );
        }
        return ret;
    },

    // remove returns true or throws an exception
    'thoughts.remove'( o ){
        Meteor.call( '_articles_check_type', o, 'T' );
        Meteor.call( '_articles_check_user', o );
        const ret = Articles.remove({ _id:o._id, type:'T' });
        console.log( 'Articles.thoughts.remove("'+o.name+'") returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.thoughts.remove',
                'unable to remove "'+o.name+'" thought' );
        }
        return ret;
    },

    // update returns true or throws an exception
    'thoughts.update'( id, o ){
        Meteor.call( '_articles_check_type', o, 'T' );
        Meteor.call( '_articles_check_user', o );
        const ret = Articles.update( id, { $set: {
            name: o.name,
            topic: o.topic,
            description: o.description
        }});
        console.log( 'Articles.thoughts.update("'+o.name+'") returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.thoughts.update',
                'unable to update "'+o.name+'" thought' );
        }
        return ret;
    }
});
