/*
 * 'topics_select' component.
 *  Display a drop-down box to select a topic,
 *  maybe giving an initial value as 'selected=_id' parm.
 */
import { Meteor } from 'meteor/meteor';
import { Topics } from '/imports/api/collections/topics/topics.js';
import './topics_select.html';

Template.topics_select.fn = {
    // return the identifier of the selected topic
    getSelected: function(){
        return $( '.topics-select .js-topic option:selected' ).val();
    },
    // select the default value
    selectDefault: function(){
        $('.topics-select .js-topic').val( 'none' );
    }
};

Template.topics_select.onCreated( function(){
    this.subscribe('topics.all');
});

Template.topics_select.helpers({
    // topic is the id of the topic to be selected
    isSelected( current, selected ){
        //console.log( 'topic_selected: topic='+topic+' current='+current.name+' (id='+current._id+')' );
        var value = "";
        if( selected && selected === current._id ){
            value = 'selected';
            //console.log( 'topic_selected: found topic='+current.name );
        }
        return value;
    },
    topics(){
        return Topics.find();
    }
});
