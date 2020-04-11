/*
 * 'device_perms' component.
 */
import '/imports/client/interfaces/igrid/igrid.js';
import './device_perms.html';

Template.device_perms.onRendered( function(){
    this.$( '.js-grid' ).IGrid();
});

Template.device_perms.helpers({
    actions(){
        return [ 'new', 'edit', 'delete' ];
    },
    isAllowed( type, action ){
        return Meteor.settings.isAllowed( type.type, action );
    },
    typesList(){
        return Ronin.managedArray();
    }
});
