/*
 * 'action_edit' component.
 *  Let the user edit an action.
 * 
 *  Parameters:
 *  - obj: the currently edited object.
 */
import { Actions } from '/imports/api/collections/actions/actions.js';
import '/imports/client/components/contexts_select/contexts_select.js';
import '/imports/client/components/date_select/date_select.js';
import '/imports/client/components/projects_select/projects_select.js';
import '/imports/client/components/topics_select/topics_select.js';
import './action_edit.html';

Template.action_edit.fn = {
    enable: function( selector, enable ){
        // NB: Chrome does not consider that button is member of fieldset
        //  NNB: unable to disable the button !! So hide it
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

Template.action_edit.onCreated( function(){
    this.obj = new ReactiveVar( JSON.parse( this.data ));
});

Template.action_edit.onRendered( function(){
    this.autorun(() => {
        const obj = this.obj.get();
        this.isAction = ( obj && obj.type === 'A' );
        //console.log( 'action_edit.onRendered this.isAction='+this.isAction );
        Template.action_edit.fn.enable( '.action-edit form.js-edit', this.isAction );
        if( this.isAction ){
            this.$('.js-name').focus().select();
        }
    })
});

Template.action_edit.helpers({
    button(){
        const self = Template.instance();
        const obj = self.obj.get();
        let label = 'Update';
        if( !obj || !obj._id ){
            label = 'Insert';
        }
        return label;
    },
    it(){
        const self = Template.instance();
        const obj = self.obj.get();
        return ( obj && obj.type === 'A' ) ? obj : {};
    }
});

Template.action_edit.events({
    'click .js-update'( event, instance ){
        event.preventDefault();
        // a name is mandatory
        const name = instance.$('.js-name').val();
        if( name.length ){
            const obj = Object.assign( {}, this.data.obj );
            const id = obj ? obj._id : null;
            var newobj = {
                name: name,
                topic: Template.topics_select.fn.getSelected( '.js-topic' ),
                status: Template.action_status_select.fn.getSelected( '.js-status' ),
                context: Template.contexts_select.fn.getSelected( '.js-context' ),
                outcome: instance.$('.js-outcome').val(),
                description: instance.$('.js-description').val(),
                project: Template.projects_select.fn.getSelected( '.js-project' ),
                startDate: Template.date_select.fn.getDate( '.js-datestart' ),
                dueDate: Template.date_select.fn.getDate( '.js-datedue' ),
                doneDate: Template.date_select.fn.getDate( '.js-datedone' ),
                notes: instance.$('.js-notes').val(),
            };
            if( id ){
                Meteor.call('actions.update', id, newobj, ( error ) => {
                    if( error ){
                        return throwError({ message: error.message });
                    }
                });
                newobj._id = id;
                // if project has changed, then the previous tree should be updated (refreshed)
                if( obj.project !== newobj.project ){
                    Template.projects_tree.fn.updateTree( obj );
                }
            } else {
                newobj._id = Meteor.call('actions.insert', newobj, ( error ) => {
                    if( error ){
                        return throwError({ message: error.message });
                    }
                });
            }
            Session.set( 'process.edit.obj', newobj );
        }
        return false;
    },
    'action_status_select-change .js-status'( event, instance ){
        //console.log( 'status action_status_select-change' );
        const status = Template.action_status_select.fn.getSelected( '.js-status' );
        if( status === 'don' ){
            const date = Template.date_select.fn.getDate( '.js-datedone' );
            if( !date ){
                Template.date_select.fn.setDate( '.js-datedone', Date.now());
            }
        } else {
            Template.date_select.fn.setDate( '.js-datedone', null );
        }
    },
    'date_select-change .js-datestart'( event, instance ){
        //console.log( 'dateStart date_select-change' );
    },
    'date_select-change .js-datedue'( event, instance ){
        //console.log( 'dateDue date_select-change' );
    },
    'date_select-change .js-datedone'( event, instance ){
        //console.log( 'dateDone date_select-change' );
        const date = Template.date_select.fn.getDate( '.js-datedone' );
        const obj = Session.get('process.edit.obj');
        const status = date ? 'don' : ( obj.initial_status ? obj.initial_status : 'ina' );
        Template.action_status_select.fn.setSelected( '.js-status', status );
    }
});
