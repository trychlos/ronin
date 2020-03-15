/*
 * 'thoughts_grid' component.
 *  Display thoughts in a grid.
 *
 *  Parameters:
 *  - thoughts: the thoughts cursor.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/client/components/action_button/action_button.js';
import '/imports/client/components/delete_button/delete_button.js';
import '/imports/client/components/edit_button/edit_button.js';
import '/imports/client/components/ownership_button/ownership_button.js';
import '/imports/client/components/project_button/project_button.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './thoughts_grid.html';

Template.thoughts_grid.fn = {
};

Template.thoughts_grid.onRendered( function(){
});

Template.thoughts_grid.helpers({
    getCreated( it ){
        return moment( it.createdAt ).format('DD/MM/GGGG');
    },
    getName( it ){
        return it.name;
    },
    getTopic( it ){
        const topic = Topics.findOne({ _id: it.topic });
        return topic ? topic.name : '';
    }
});

Template.thoughts_grid.events({
});
