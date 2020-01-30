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
    // create a new action starting from a thought
    'actions.from.thought'( thought, action ){
        if( thought.type !== 'T' ){
            throw new Meteor.Error(
                'articles.invalid_type',
                 thought.type+': invalid type (permitted values are ['+Articles.fn.types.join(',')+']'
            );
        }
        // canonic fields order (from ../articles.js)
        const ret = Articles.update( thought._id, { $set: {
            type: 'A',
            name: action.name,
            topic: action.topic,
            description: action.description,
            startDate: action.start,
            dueDate: action.due,
            doneDate: action.done,
            parent: action.project,
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
    'actions.insert'( o ){
        return Articles.insert({
            name: o.name,
            topic: o.topic,
            context: o.context,
            status: o.status,
            outcome: o.outcome,
            description: o.description,
            startDate: o.startDate,
            dueDate: o.dueDate,
            doneDate: o.doneDate,
            project: o.project,
            notes: o.notes
        });
    },
    'actions.remove'( id ){
        console.log( 'actions.remove id='+id );
        Articles.remove(id);
    },
    'actions.project'( id, project ){
        return Articles.update({ _id:id }, { $set: { project: project }});
    },
    'actions.update'( id, o ){
        return Articles.update({ _id:id }, { $set: {
            name: o.name,
            topic: o.topic,
            context: o.context,
            status: o.status,
            outcome: o.outcome,
            description: o.description,
            startDate: o.startDate,
            dueDate: o.dueDate,
            doneDate: o.doneDate,
            project: o.project,
            notes: o.notes
        }});
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
                'articles.invalid_type',
                 o.type+': invalid type (permitted values are ['+Articles.fn.types.join(',')+']'
            );
        }
        const ret = Articles.update( id, { $set: {
            name: o.name,
            description: o.description,
            topic: o.topic
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