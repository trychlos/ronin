/*
 * 'editWindow' window.
 *  This is the main component for projects and actions edition.
 *  This window implements a dynamic template, depending of the actual type
 *  of the currently edited object.
 * 
 *  NB: several 'editWindow' windows may be simultaneously opened.
 *  This is realized by:
 *  - use a session variable in editPage to make it reactive
 *  - transform here the session variable in a reactive var attached to the
 *      template instance in order to have several windows with different
 *      objects.
 * 
 *  Session variables:
 *  - process.edit.obj: the current edited object.
 */
import '/imports/client/components/action_edit/action_edit.js';
import '/imports/client/components/project_edit/project_edit.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './edit_window.html';

Template.editWindow.onCreated( function(){
    this.obj = new ReactiveVar( Session.get('process.edit.obj'));
    //console.log( 'editWindow.onCreated this.obj='+JSON.stringify( this.obj.get()));
});

Template.editWindow.onRendered( function(){
    this.autorun(() => {
        if( g.taskbar.get()){
            const obj = this.obj.get();
            let title = 'Edit';
            title += obj && obj.name ? ' - '+obj.name : '';
            this.$('div.edit-window').IWindowed({
                template:   'editWindow',
                group:      'processWindow',
                title:       title
            });
        }
    });
});

Template.editWindow.helpers({
    // pass the edited javascript object to the edition template
    //  as a JSON string
    obj(){
        const self = Template.instance();
        return JSON.stringify( self.obj.get());
    },
    template(){
        const self = Template.instance();
        const obj = self.obj ? self.obj.get() : null;
        const template = obj && obj.type === 'A' ? 'action_edit' : 'project_edit';
        return template;
    }
});
