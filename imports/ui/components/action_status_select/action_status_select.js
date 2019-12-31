/*
 * 'action_status_select' component.
 *  Display a drop-down box to select an action status.
 *  Parameters:
 *  - 'selected=code' (optional) initial selected item's code.
 */
import { Meteor } from 'meteor/meteor';
import { ActionStatus } from '/imports/api/collections/action_status/action_status.js';
import './action_status_select.html';

Template.action_status_select.fn = {
    // return the code associated to the selected action_status
    getSelected: function( selector ){
        const instance = Template.instance();
        return instance.view.isRendered ? instance.$( selector+' .js-status-select option:selected').val() : null;
    },
    // select a value
    setSelected: function( selector, value ){
        //console.log( 'setSelected '+value );
        const instance = Template.instance();
        if( instance.view.isRendered ){
            instance.$( selector+' .js-status-select' ).val( value );
        }
    },
};

Template.action_status_select.helpers({
    statusCursor(){
        return ActionStatus.find();
    },
    statusSelected( current, selected ){
        var value = "";
        if( selected && selected === current.code ){
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
