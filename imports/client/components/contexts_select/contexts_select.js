/*
 * 'contexts_select' component.
 *  Display a drop-down box to select a context.
 *
 *  Parameters:
 *  - 'selected=_id' (optional) set the initially selected value.
 */
import { Meteor } from 'meteor/meteor';
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import './contexts_select.html';

Template.contexts_select.fn = {
    // return the identifier of the selected topic
    getSelected: function( $parent ){
        return $( $parent.find( '.contexts-select .js-select option:selected')[0] ).val();
    },
    // select a value
    setSelected: function( $parent, value ){
        $( $parent.find( '.contexts-select .js-select' )[0] ).val( value );
    },
    // select the default value
    selectDefault: function( $parent ){
        Template.contexts_select.fn.setSelected( $parent, 'none' );
    }
};

Template.contexts_select.onCreated( function(){
    this.subscribe('contexts.all');
});

Template.contexts_select.helpers({
    isSelected( current, selected ){
        var value = "";
        if( selected && selected === current._id ){
            value = 'selected';
        }
        return value;
    },
    contexts(){
        return Contexts.find();
    }
});

Template.contexts_select.events({
});
