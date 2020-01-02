/*
 * 'setup_contexts' component.
 *  Edit, create, delete and list contexts.
 *  This component itself embeds two other UI components:
 *  - context_edit
 *  - contexts_list.
 * 
 *  Session variables:
 *  - 'setup.contexts.obj': the edited object, selected in contexts_list.
 */
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import '/imports/client/components/context_edit/context_edit.js';
import '/imports/client/components/contexts_list/contexts_list.js';
import './setup_contexts.html';

Template.setup_contexts.onCreated( function(){
    this.subscribe('contexts.all');
});

Template.setup_contexts.helpers({
    contexts(){
        return Contexts.find({}, { sort:{ createdAt: -1 }});
    },
});
