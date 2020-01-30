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
    // the thought is deleted after successful action creation
    'actions.fromThought'(o){
        var actionId = null;
        if( o.thought.id ){
            actionId = Articles.insert({
                name: o.action.name,
                topic: o.action.topic,
                context: o.action.context,
                status: o.action.status,
                outcome: o.action.outcome,
                description: o.action.description,
                startDate: o.action.start,
                dueDate: o.action.due,
                doneDate: o.action.done,
                project: o.action.project
            });
            Meteor.call('thoughts.remove', o.thought.id );
        } else {
            console.log( 'actions.fromThought() thought id is empty' );
        }
        return actionId;
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
