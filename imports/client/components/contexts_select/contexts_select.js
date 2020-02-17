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
    getSelected: function(){
        return $( ' .js-contexts-select option:selected').val();
    },
    // select the default value
    selectDefault: function(){
        const obj = Contexts.findOne({ default: true });
        if( obj ){
            $('.js-contexts-select').val( obj._id );
        }
    },
};

Template.contexts_select.onCreated( function(){
    this.subscribe('contexts.all');
});

Template.contexts_select.helpers({
    contexts(){
        return Contexts.find();
    },
    selected( current, selected ){
        var value = "";
        if( selected && selected === current._id ){
            value = 'selected';
        }
        return value;
    }
});

Template.contexts_select.events({
});
