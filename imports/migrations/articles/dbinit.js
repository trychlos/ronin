/*
 * dbinit.js: Articles collection initialization.
 *
 * For each thoughts, actions, projects collection:
 *  - if the collection exists
 *      copy the content to this Articles collection
 *      drop the collection.
 *
 * This is ran once when transitionning from Thoughts/Actions/Projects to Articles.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';

/*
import { Thoughts } from '/imports/api/collections/thoughts/thoughts.js';
if( false ){
    Thoughts.find().forEach(  it => {
        let o = {
            type: 'T',
            name: it.name
        };
        if( it.topic ){
            o.topic = it.topic;
        }
        if( it.description ){
            o.description = it.description;
        }
        console.log( "Articles: inserting (T) '"+o.name+"'" );
        let id = Articles.insert( o );
    });
}
*/

/*
// note that we are copying the source attached project id
//  which is most probably wrong as the project id changes with this operation
import { Actions } from '/imports/api/collections/actions/actions.js';
if( false ){
    Actions.find().forEach(  it => {
        let o = {
            type: 'A',
            name: it.name
        };
        if( it.topic ){
            o.topic = it.topic;
        }
        if( it.description ){
            o.description = it.description;
        }
        if( it.notes ){
            o.notes = it.notes;
        }
        if( it.startDate ){
            o.startDate = it.startDate;
        }
        if( it.dueDate ){
            o.dueDate = it.dueDate;
        }
        if( it.doneDate ){
            o.doneDate = it.doneDate;
        }
        if( it.project ){
            o.parent = it.project;
        }
        if( it.status ){
            o.status = it.status;
        }
        if( it.context ){
            o.context = it.context;
        }
        if( it.context ){
            o.context = it.context;
        }
        console.log( "Articles: inserting (A) '"+o.name+"'" );
        let id = Articles.insert( o );
    });
}
*/

/*
// note that we are copying the source project parent id
//  which is most probably wrong as the project id changes with this operation
import { Projects } from '/imports/api/collections/projects/projects.js';
if( false ){
    Projects.find().forEach(  it => {
        let o = {
            type: 'P',
            name: it.name
        };
        if( it.topic ){
            o.topic = it.topic;
        }
        if( it.description ){
            o.description = it.description;
        }
        if( it.notes ){
            o.notes = it.notes;
        }
        if( it.startDate ){
            o.startDate = it.startDate;
        }
        if( it.dueDate ){
            o.dueDate = it.dueDate;
        }
        if( it.doneDate ){
            o.doneDate = it.doneDate;
        }
        if( it.parent ){
            o.parent = it.parent;
        }
        if( it.future ){
            o.status = 'fut';
        }
        if( it.ended ){
            o.status = 'don';
        }
        if( it.vision ){
            o.vision = it.vision;
        }
        if( it.brainstorm ){
            o.brainstorm = it.brainstorm;
        }
        console.log( "Articles: inserting (P) '"+o.name+"'" );
        let id = Articles.insert( o );
    });
}
*/
