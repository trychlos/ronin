import { Meteor } from 'meteor/meteor';
import { Thoughts } from '/imports/api/collections/thoughts/thoughts.js';
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
    }
  });

