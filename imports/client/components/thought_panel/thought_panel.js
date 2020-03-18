/*
 * 'thought_panel' component.
 *
 *  A collapsable panel which let the user:
 *  - enter a new thought (if data/item is null or empty)
 *  - or edit an existing one (if data/item is set).
 *
 *  Parameters:
 *  - collapsable=true|false whether this component may be collapsed
 *      defaulting to false.
 *  - item: the thought being edited, may be null.
 */
import '/imports/client/components/topics_select/topics_select.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './thought_panel.html';

Template.thought_panel.fn = {
    // provides a unique id for the collapsable part
    collapsableId: function(){
        return '98e84c99-d2f3-4c54-96a3-b4d6ccf8b3f0';
    },
    // returns an object which holds the form content
    getContent: function( $dom ){
        let o =  null;
        if( $dom ){
            $o = {
                type: 'T',
                name: $( $dom.find( '.js-name' )[0] ).val(),
                description: $( $dom.find( '.js-description' )[0] ).val(),
                topic: Template.topics_select.fn.getSelected( $dom )
            }
        }
        return o;
    },
    // initialize the edition area
    // NB: do not reinitialize the topic
    //  Rationale: when entering several thoughts, it is more that possible that
    //  all will be relative to a same topic, so try to gain some time
    initEditArea: function( $dom ){
        if( $dom ){
            $( $dom.find( '.js-name')[0] ).val('');
            $( $dom.find( '.js-description' )[0] ).val('');
            //Template.topics_select.fn.selectDefault( $dom );
        }
    }
};

Template.thought_panel.helpers({
    // provides a unique id for the collapsable part
    collapsableId(){
        return Template.thought_panel.fn.collapsableId();
    },
    descriptionPlaceholder(){
        return this.item ? '' : 'Description of the new thought';
    },
    descriptionValue(){
        return this.item ? this.item.description : '';
    },
    namePlaceholder(){
        return this.item ? '' : 'Type to add new thought';
    },
    nameValue(){
        return this.item ? this.item.name : '';
    },
    topic(){
        return this.item ? this.item.topic : null;
    }
});
