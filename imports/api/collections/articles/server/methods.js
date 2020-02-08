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

    // action is said undone (back from done)
    //  must be called from Articles.fn.doneToggle()
    '_actions.done.clear'( o ){
        if( o.type !== 'A' ){
            throw new Meteor.Error(
                'articles.invalid_type', o.type+': invalid type ("A" expected)'
            );
        }
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
    '_actions.done.set'( o ){
        if( o.type !== 'A' ){
            throw new Meteor.Error(
                'articles.invalid_type', o.type+': invalid type ("A" expected)'
            );
        }
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

    // create a new action starting from a thought
    'actions.from.thought'( thought, action ){
        if( thought.type !== 'T' ){
            throw new Meteor.Error(
                'articles.invalid_type', o.type+': invalid type ("T" expected)'
                );
        }
        // canonic fields order (from ../articles.js)
        const ret = Articles.update( thought._id, { $set: {
            type: 'A',
            name: action.name,
            topic: action.topic,
            description: action.description,
            notes: action.notes,
            startDate: action.startDate,
            dueDate: action.dueDate,
            doneDate: action.doneDate,
            parent: action.parent,
            status: action.status,
            context: action.context,
            outcome: action.outcome
        }});
        console.log( 'Articles.actions.from.thought("'+action.name+'") returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.actions.from.thought',
                'unable to transform "'+thought.name+'" into an action' );
        }
        return ret;
    },

    // insert a new action
    'actions.insert'( o ){
        if( o.type !== 'A' ){
            throw new Meteor.Error(
                'articles.invalid_type', o.type+': invalid type ("A" expected)'
            );
        }
        const ret = Articles.insert({
            type: o.type,
            name: o.name,
            topic: o.topic,
            description: o.description,
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
    'actions.remove'( id ){
        console.log( 'articles.actions.remove id='+id );
        Articles.remove( id );
    },

    // update an existing action
    'actions.update'( id, o ){
        if( o.type !== 'A' ){
            throw new Meteor.Error(
                'articles.invalid_type', o.type+': invalid type ("A" expected)'
            );
        }
        const ret = Articles.update( id, { $set: {
            name: o.name,
            topic: o.topic,
            description: o.description,
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
    'articles.ownership'( id ){
        if( !this.userId ){
            throw new Meteor.Error(
                'articles.ownership', 'user must be logged-in'
            );
        }
        const ret = Articles.update( id, { $set: { userId: this.userId }});
        console.log( 'Articles.ownership("'+id+'") returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.ownership',
                'unable to take ownership of the "'+id+'" article' );
        }
        return ret;
    },

    // change the parent of an action or a project
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

    // create a new project from a thought
    'projects.from.thought'( thought, project ){
        if( thought.type !== 'T' ){
            throw new Meteor.Error(
                'articles.invalid_type', thought.type+': invalid type ("T" expected)'
            );
        }
        // canonic fields order (from ../articles.js)
        const ret = Articles.update( thought._id, { $set: {
            type: 'P',
            name: project.name,
            topic: project.topic,
            description: project.description,
            notes: project.notes,
            startDate: project.startDate,
            dueDate: project.dueDate,
            doneDate: project.doneDate,
            parent: project.parent,
            status: project.status,
            future: project.future || false,
            vision: project.vision,
            brainstorm: project.brainstorm
        }});
        console.log( 'Articles.projects.from.thought("'+project.name+'") returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.projects.from.thought',
                'unable to transform "'+thought.name+'" into a project' );
        }
        return ret;
    },

    // insert a new project
    'projects.insert'( o ){
        if( o.type !== 'P' ){
            throw new Meteor.Error(
                'articles.invalid_type', o.type+': invalid type ("P" expected)'
            );
        }
        const ret = Articles.insert({
            type: o.type,
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
    'projects.remove'( id ){
        console.log( 'articles.projects.remove id='+id );
        Articles.remove( id );
    },

    // update an existing project
    'projects.update'( id, o ){
        if( o.type !== 'P' ){
            throw new Meteor.Error(
                'articles.invalid_type', o.type+': invalid type ("P" expected)'
            );
        }
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
    'thoughts.insert'( o ){
        if( o.type !== 'T' ){
            throw new Meteor.Error(
                'articles.invalid_type',
                 o.type+': invalid type (permitted values are ['+Articles.fn.types.join(',')+']'
            );
        }
        const ret = Articles.insert({
            type: o.type,
            name: o.name,
            topic: o.topic,
            description: o.description
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
    'thoughts.remove'( id ){
        const ret = Articles.remove({ _id:id, type:'T' });
        console.log( 'Articles.thoughts.remove("'+id+'") returns '+ret );
        if( !ret ){
            throw new Meteor.Error(
                'articles.thoughts.remove',
                'unable to remove "'+id+'" thought' );
        }
        return ret;
    },

    // update returns true or throws an exception
    'thoughts.update'( id, o ){
        if( o.type !== 'T' ){
            throw new Meteor.Error(
                'articles.invalid_type', o.type+': invalid type ("T" expected)'
            );
        }
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
