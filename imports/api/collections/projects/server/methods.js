import { Meteor } from 'meteor/meteor';
import { Projects } from '../projects.js';

Meteor.methods({
    // create a new project starting from a thought
    // the thought is deleted after successful project creation
    'projects.fromThought'( o ){
        var projectId = null;
        if( o.thought.id ){
            projectId = Projects.insert({
                name: o.project.name,
                topic: o.project.topic,
                purpose: o.project.purpose,
                vision: o.project.vision,
                brainstorm: o.project.brainstorm,
                description: o.project.description,
                startDate: o.project.start,
                dueDate: o.project.due,
                doneDate: o.project.done,
                future: o.project.future,
                parent: 'root'
            });
            Meteor.call('thoughts.remove', o.thought.id );
        } else {
            console.log( 'projects.fromThought() thought id is empty' );
        }
        return projectId;
    },
    'projects.insert'( o ){
        return Projects.insert({
            name: o.name,
            topic: o.topic,
            purpose: o.purpose,
            vision: o.vision,
            brainstorm: o.brainstorm,
            description: o.description,
            startDate: o.startDate,
            dueDate: o.dueDate,
            doneDate: o.doneDate,
            future: o.future,
            parent: o.parent ? o.parent : 'root',
            notes: o.notes
        });
    },
    'projects.remove'( id ){
        Projects.remove(id);
    },
    'projects.setParent'( id, parent ){
        console.log( 'projects.setParent() id='+id+' parent='+parent );
        Projects.update({ _id:id }, { $set: { parent: parent }});
    },
    'projects.update'( id, o ){
        return Projects.update({ _id:id }, { $set: {
            name: o.name,
            topic: o.topic,
            purpose: o.purpose,
            vision: o.vision,
            brainstorm: o.brainstorm,
            description: o.description,
            startDate: o.startDate,
            dueDate: o.dueDate,
            doneDate: o.doneDate,
            future: o.future,
            parent: o.parent ? o.parent : 'root',
            notes: o.notes
        }});
    }
});
