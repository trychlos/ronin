/*
 * 'action_status_select' component.
 *  Display a drop-down box to select an action status.
 *
 *  Parameters:
 *  - 'selected=id' (optional) initial selected status's identifier.
 */
import { Meteor } from 'meteor/meteor';
import { actionStatus } from '/imports/api/resources/action_status/action_status.js';
import './action_status_select.html';

Template.action_status_select.fn = {
    // return the code associated to the selected action_status
    getSelected: function(){
        return $( '.action-status-select .js-select option:selected' ).val();
    },
    // select a value
    setSelected: function( value ){
        $( '.action-status-select .js-select' ).val( value );
    },
    // reset the default value
    selectDefault: function(){
        const def = actionStatus.getDefault();
        $( '.action-status-select .js-select' ).val( def );
    },
};

Template.action_status_select.helpers({
    statusList(){
        return actionStatus.all();
    },
    statusSelected( current, selected ){
        var value = "";
        if( selected && selected === current.id ){
            value = 'selected';
        }
        return value;
    }
});

Template.action_status_select.events({
    'change .js-status-select'( event, instance ){
        instance.$('.js-status-select').trigger('action_status_select-change');
    }
});
