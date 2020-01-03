/*
 * 'editWindow' window.
 *  This is the main component for projects and actions edition.
 *  This window implements a dynamic template, depending of the actual type
 *  of the currently edited object.
 * 
 *  NB: several 'editWindow' windows may be simultaneously opened.
 * 
 *  Session variables:
 *  - process.detail.obj: the current edited object.
 */
import '/imports/client/components/action_edit/action_edit.js';
import '/imports/client/components/project_edit/project_edit.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './edit_window.html';

Template.editWindow.onRendered( function(){
    this.autorun(() => {
        if( g.taskbar.get()){
            const obj = Session.get('process.detail.obj');
            let title = 'Edit';
            title += obj && obj.name ? ' - '+obj.name : '';
            $('div.edit-window').IWindowed({
                template:   'editWindow',
                group:      'processWindow',
                title:       title
            });
        }
    });
});

Template.editWindow.helpers({
    template(){
        const obj = Session.get('process.detail.obj');
        return obj && obj.type === 'A' ? 'action_edit' : 'project_edit';
    }
});
