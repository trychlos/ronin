/*
 * 'setup_contexts' component.
 *  Edit, create, delete and list contexts.
 *  This component itself embeds two other UI components:
 *  - context_edit
 *  - contexts_list.
 *  Session variables:
 *  - 'setup.contexts.obj': the edited object, selected in contexts_list.
 */
import { Meteor } from 'meteor/meteor';
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import '/imports/ui/components/context_edit/context_edit.js';
import '/imports/ui/components/contexts_list/contexts_list.js';
import './setup_contexts.html';

Template.setup_contexts.onCreated( function(){
    Meteor.subscribe('contexts.all');
});

Template.setup_contexts.helpers({
    contexts_cursor(){
        return Contexts.find({}, { sort:{ createdAt: -1 }});
    },
});

Template.setup_contexts.events({
});
