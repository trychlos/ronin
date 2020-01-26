/*
 * 'thoughts_list_item' component.
 *  Display one item of a list of thoughts, giving a one-element thought
 *
 *  Parameters:
 *  - thought: the cursor (aka an array) to be displayed
 *
 *  NB: this component is used both as a reminder when collecting new thoughts,
 *      and as a dispatcher when processing thoughts.
 */
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/client/components/thoughts_list_edit/thoughts_list_edit.js';
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
        const collapsed = this.collapsed.get();
        const divId = Template.thoughts_list_item.fn.itemDivId();
        if( collapsed ){
            $( '#'+divId ).removeClass( 'opened-card' );
        } else {
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
    'click .js-collapse'( ev, instance ){
        const collapsed = instance.collapsed.get();
        instance.collapsed.set( !collapsed );
    }
});
