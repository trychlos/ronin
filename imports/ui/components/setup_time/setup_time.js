/*
 * 'setup_time' component.
 *  Edit, create, delete and list time values.
 *  This component itself embeds two other UI components:
 *  - time_value_edit
 *  - time_values_list.
 *  Session variables:
 *  - 'setup.time_values.obj': the edited object, selected in time_values_list.
 */
import { Meteor } from 'meteor/meteor';
import { TimeValues } from '/imports/api/collections/time_values/time_values.js';
import '/imports/ui/components/time_value_edit/time_value_edit.js';
import '/imports/ui/components/time_values_list/time_values_list.js';
import './setup_time.html';

Template.setup_time.onCreated( function(){
    Meteor.subscribe('time_values.all');
});

Template.setup_time.helpers({
    time_values_cursor(){
        return TimeValues.find({}, { sort:{ createdAt: -1 }});
    },
});

Template.setup_time.events({
});
