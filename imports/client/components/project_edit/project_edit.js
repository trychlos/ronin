/*
 * 'project_edit' component.
 *  Let the user edit an existing project.
 *
 *  Parameters:
 *  - obj: the object being edited (a project or an action).
 */
import { Projects } from '/imports/api/collections/projects/projects.js';
import '/imports/client/components/date_select/date_select.js';
import '/imports/client/components/projects_select/projects_select.js';
import '/imports/client/components/topics_select/topics_select.js';
import './project_edit.html';

Template.project_edit.fn = {
    close: function( self ){
        const $div = $( self.$('.project-edit').parents('div.edit-window')[0] );
        $div.IWindowed('close');
    },
    enable: function( selector, enable ){
        // NB: Chrome does not consider that button is member of fieldset
        if( enable ){
            $(selector+' fieldset').removeAttr('disabled');
            //$(selector+' button.js-update').removeProp('disabled');
            $(selector+' button.js-update').show();
        } else {
            $(selector+' fieldset').attr('disabled','disabled');
            //$(selector+' button.js-update').prop('disabled', true );
            $(selector+' button.js-update').hide();
        }
    }
};

Template.project_edit.onCreated( function(){
    this.obj = new ReactiveVar( JSON.parse( this.data ));
});

Template.project_edit.onRendered( function(){
    this.autorun(() => {
        const obj = this.obj.get();
        this.isProject = ( obj && obj.type === 'P' );
        //console.log( 'project_edit.onRendered this.isProject='+this.isProject );
        Template.project_edit.fn.enable( '.project-edit form.js-edit', this.isProject );
        if( this.isProject ){
            this.$('.js-name').focus().select();
        }
    })
});

Template.project_edit.helpers({
    button(){
        const self = Template.instance();
        const obj = self.obj.get();
        let label = 'Update';
        if( !obj || !obj._id ){
            label = 'Insert';
        }
        return label;
    },
    isFuture( future ){
       return future ? 'checked' : '';
    },
    it(){
        const self = Template.instance();
        const obj = self.obj.get();
        return ( obj && obj.type === 'P' ) ? obj : {};
    }
});

Template.project_edit.events({
    'click .js-cancel'( event, instance ){
        event.preventDefault();
        Template.project_edit.fn.close( instance );
        return false;
    },
    'click .js-update'( event, instance ){
        event.preventDefault();
        // a name is mandatory
        const name = instance.$('.js-name').val();
        if( name.length ){
            const obj = Object.assign( {}, instance.obj.get());
            const id = obj ? obj._id : null;
            var newobj = {
                name: name,
                topic: Template.topics_select.fn.getSelected(),
                purpose: instance.$('.js-purpose').val(),
                vision: instance.$('.js-vision').val(),
                brainstorm: instance.$('.js-brainstorm').val(),
                description: instance.$('.js-description').val(),
                startDate: Template.date_select.fn.getDate( '.js-datestart' ),
                dueDate: Template.date_select.fn.getDate( '.js-datedue' ),
                doneDate: Template.date_select.fn.getDate( '.js-datedone' ),
                parent: Template.projects_select.fn.getSelected( '.js-parent' ),
                future: instance.$('.js-future').is(':checked'),
                notes: instance.$('.js-notes').val(),
            };
            if( id ){
                Meteor.call('projects.update', id, newobj, ( error ) => {
                    if( error ){
                        return throwError({ message: error.message });
                    }
                });
                newobj._id = id;
                // if project.future has changed, then the previous tree should be updated (refreshed)
                if( obj.future !== newobj.future ){
                    Session.set( 'process.obsolete.obj',
                        { id:id, type:'P', changes: [
                            { data:'future', oldvalue:obj.future }
                    ]});
                }
                $( document.body ).trigger( 'project-edit', { old:obj, new:newobj });
            } else {
                newobj._id = Meteor.call('projects.insert', newobj, ( error ) => {
                    if( error ){
                        return throwError({ message: error.message });
                    }
                });
            }
            Template.project_edit.fn.close( instance );
        }
        return false;
    }
});
