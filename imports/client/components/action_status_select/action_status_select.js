/*
 * 'action_status_select' component.
 *  Display a drop-down box to select an action status.
 *
 *  Parameters:
 *  - 'selected=id' (optional) initial selected status's identifier.
 */
import { Meteor } from 'meteor/meteor';
import { ActionStatus } from 'meteor/pwi:ronin-action-status';
import './action_status_select.html';

Template.action_status_select.fn = {
    // return the code associated to the selected action_status
    getSelected: function( $parent ){
        return $( $parent.find( '.action-status-select .js-select option:selected' )[0] ).val();
    },
    // select a value
    setSelected: function( $parent, value ){
        $( $parent.find( '.action-status-select .js-select' )[0] ).val( value );
    },
    // reset the default value
    selectDefault: function( $parent ){
        Template.action_status_select.fn.setSelected( $parent, actionStatus.getDefault());
    },
};

Template.action_status_select.helpers({
    statusList(){
        return ActionStatus.all();
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
        instance.$('.js-status-select').trigger('action-status-select-change');
    }
});
