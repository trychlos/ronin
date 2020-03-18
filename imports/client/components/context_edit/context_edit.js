/*
 * 'context_edit' component.
 *  Let the user
 *  - enter a new context (session/setup.context.obj empty)
 *  - or edit an existing one (session/setup.context.obj already exists).
 *  Session variables:
 *  - 'setup.contexts.obj': the edited object, selected in contexts_list.
 */
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import './context_edit.html';

Template.context_edit.fn = {
    // initialize the edition area
    // this is needed when we cancel a current creation
    //  as this will not change the setup.topics.obj session variable
    //  no helper is triggered,
    //  and we have to manually reinit the fields
    initEditArea: function(){
        const instance = Template.instance();
        if( instance.view.isRendered ){
            instance.$('.js-name').val('');
            instance.$('.js-description').val('');
        }
    }
};

Template.context_edit.helpers({
    descriptionPlaceholder(){
        return Session.get('setup.contexts.obj') ? '' : 'Description of the new context';
    },
    descriptionValue(){
        const obj = Session.get('setup.contexts.obj');
        return obj ? obj.description : '';
    },
    namePlaceholder(){
        return Session.get('setup.contexts.obj') ? '' : 'Type to add new context';
    },
    nameValue(){
        const obj = Session.get('setup.contexts.obj');
        return obj ? obj.name : '';
    },
    submit(){
        return Session.get('setup.contexts.obj') ? 'Update' : 'Create';
    },
    title(){
        return Session.get('setup.contexts.obj') ? 'Edit context' : 'New context';
    },
});

Template.context_edit.events({
    'click .js-cancel'(event){
        event.preventDefault();
        Session.set( 'setup.contexts.obj', null );
        Template.context_edit.fn.initEditArea();
        return false;
    },
   'submit .js-edit'( event, instance ){
        event.preventDefault();
        //const target = event.target;            // target=[object HTMLFormElement]
        const name = instance.$('.js-name').val();
        const description = instance.$('.js-description').val();
        // a name is mandatory
        if( name.length ){
            const obj = Session.get( 'setup.contexts.obj' );
            const id = obj ? obj._id : null;
            var newobj = {
                name: name,
                description: description
            };
            try {
                Contexts.fn.check( id, newobj );
            } catch( e ){
                return messageError({ message: e.message });
            }
            //console.log( 'submit.edit: Contexts.fn.check() successful' );
            if( obj ){
                // if nothing has changed, then does nothing
                if( Contexts.fn.equal( obj, newobj )){
                        return false;
                }
                Meteor.call('contexts.update', id, newobj, ( error ) => {
                    if( error ){
                        return messageError({ message: error.message });
                    }
                });
            } else {
                Meteor.call('contexts.insert', newobj, ( error ) => {
                    if( error ){
                        return messageError({ message: error.message });
                    }
                });
            }
            //console.log( 'submit.edit: reinitializing Session(setup.contexts.obj)' );
            Session.set( 'setup.contexts.obj', null );
            Template.context_edit.fn.initEditArea();
        }
        return false;
    },
});
