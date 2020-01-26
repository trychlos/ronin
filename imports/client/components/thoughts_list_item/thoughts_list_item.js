/*
 * 'thoughts_list_item' component.
 *  Display one item of a list of thoughts, giving a one-element thought
 *
 *  Parameters:
 *  - thought: the one-item cursor (aka an array) to be displayed
 */
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/client/components/thoughts_list_card/thoughts_list_card.js';
import './thoughts_list_item.html';

Template.thoughts_list_item.fn = {
    collapsableId : function(){
        return 'collapsable_'+Template.currentData().thought._id;
    },
    itemDivId : function(){
        return 'item_div_'+Template.currentData().thought._id;
    }
}

Template.thoughts_list_item.onCreated( function(){
    this.collapsed = new ReactiveVar( true );
});

Template.thoughts_list_item.onRendered( function(){
    this.autorun(() => {
        const divId = Template.thoughts_list_item.fn.itemDivId();
        if( !this.collapsed.get()){
            $( '#'+divId ).addClass( 'opened-card' );
        }
    });
});

Template.thoughts_list_item.helpers({
    classCreatedAt(){
        return $(window).innerWidth() <= 480 ? 'x-hidew480' : 'w-25';
    },
    classTopic(){
        return $(window).innerWidth() <= 480 ? 'w-50' : 'w-25';
    },
    collapsableId(){
        return Template.thoughts_list_item.fn.collapsableId();
    },
    itemDivId(){
        return Template.thoughts_list_item.fn.itemDivId();
    },
    topic_byId( id ){
        const obj = id ? Topics.findOne({ _id:id }) : null;
        return obj ? obj.name : '';
    }
});

Template.thoughts_list_item.events({
    'hide.bs.collapse'( event, instance ){
        $( event.target ).trigger( 'show.bs.collapse.ronin' );
        instance.collapsed.set( true );
    },
    'show.bs.collapse'( event, instance ){
        $( event.target ).trigger( 'show.bs.collapse.ronin' );
        instance.collapsed.set( false );
    }
});
