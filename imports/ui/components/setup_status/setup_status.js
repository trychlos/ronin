/*
 * 'setup_status' component.
 *  Edit, create, delete and list action status.
 *  This component itself embeds two other UI components:
 *  - action_status_edit
 *  - action_status_list.
 *  Session variables:
 *  - 'setup.action_status.obj': the edited object, selected in action_status_list.
 */
import { Meteor } from 'meteor/meteor';
import { ActionStatus } from '/imports/api/collections/action_status/action_status.js';
import '/imports/ui/components/action_status_edit/action_status_edit.js';
import '/imports/ui/components/action_status_list/action_status_list.js';
import './setup_status.html';

Template.setup_status.onCreated( function(){
    Meteor.subscribe('action_status.all');
});

Template.setup_status.helpers({
    action_status_cursor(){
        return ActionStatus.find({}, { sort:{ createdAt: -1 }});
    },
});

Template.setup_status.events({
});
