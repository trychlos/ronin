/*
 * 'setup_refs' component.
 *  Edit, create, delete and list time values.
 *  This component itself embeds two other UI components:
 *  - time_value_edit
 *  - time_values_list.
 *  Session variables:
 *  - 'setup.time_values.obj': the edited object, selected in time_values_list.
 */
import { Meteor } from 'meteor/meteor';
import './setup_refs.html';

Template.setup_refs.onCreated( function(){
});

Template.setup_refs.helpers({
});

Template.setup_refs.events({
});
