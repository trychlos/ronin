/*
 * 'setup_priority' component.
 *  Edit, create, delete and list prioriuty values.
 *  This component itself embeds two other UI components:
 *  - priority_value_edit
 *  - priority_values_list.
 * 
 *  Session variables:
 *  - 'setup.priority_values.obj': the edited object, selected in priority_values_list.
 */
import { PriorityValues } from '/imports/api/collections/priority_values/priority_values.js';
import '/imports/ui/components/priority_value_edit/priority_value_edit.js';
import '/imports/ui/components/priority_values_list/priority_values_list.js';
import './setup_priority.html';

Template.setup_priority.onCreated( function(){
    this.subscribe('priority_values.all');
});

Template.setup_priority.helpers({
    priorities(){
        return PriorityValues.find({}, { sort:{ createdAt: -1 }});
    },
});
