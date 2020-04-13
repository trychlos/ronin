/*
 * 'device_perms' component.
 */
import '/imports/client/interfaces/igrid/igrid.js';
import './device_perms.html';

Template.device_perms.fn = {
    cmpDelete( a, b ){
        return Template.device_perms.fn.compare( a, b, R_ACT_DELETE );
    },
    cmpEdit( a, b ){
        return Template.device_perms.fn.compare( a, b, R_ACT_EDIT );
    },
    cmpNew( a, b ){
        return Template.device_perms.fn.compare( a, b, R_ACT_NEW );
    },
    compare( a, b, action ){
        const a_allowed = Meteor.settings.isAllowed( $( a ).attr( 'data-row-id' ), action );
        const b_allowed = Meteor.settings.isAllowed( $( b ).attr( 'data-row-id' ), action );
        return a_allowed === b_allowed ? 0 : ( a_allowed ? 1 : -1 );
    }
}

Template.device_perms.onRendered( function(){
    this.$( '.js-grid' ).IGrid({
        sort: {
            compare: [
                {
                    column: R_ACT_NEW,
                    compare: Template.device_perms.fn.cmpNew
                },
                {
                    column: R_ACT_EDIT,
                    compare: Template.device_perms.fn.cmpEdit
                },
                {
                    column: R_ACT_DELETE,
                    compare: Template.device_perms.fn.cmpDelete
                }
            ]
        }
    });
});

Template.device_perms.helpers({
    actionsList(){
        return Ronin.toArray( Ronin.managedActions );
    },
    isAllowed( type, action ){
        return Meteor.settings.isAllowed( type.key, action.key );
    },
    typesList(){
        return Ronin.toArray( Ronin.managedTypes );
    }
});
