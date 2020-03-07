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
    getContent: function(){
        const $this = $( '.thought-panel' );
        return {
            type: 'T',
            name: $this.find('.js-name').val(),
            description: $this.find('.js-description').val(),
            topic: Template.topics_select.fn.getSelected()
        }
    },
    // initialize the edition area
    // NB: do not reinitialize the topic
    //  Rationale: when entering several thoughts, it is probable that all
    //  will be relative to a same topic, so try to gain some time
    initEditArea: function(){
        const instance = Template.instance();
        if( instance.view.isRendered ){
            instance.$('.js-name').val('');
            instance.$('.js-description').val('');
            //Template.topics_select.fn.selectDefault();
        }
    }
};

Template.thought_panel.onRendered( function(){
    const item = this.data.item;

    this.autorun(() => {
        const status = Session.get( 'collect.dbope' );
        switch( status ){
            // successful update operation, leave the page
            case DBOPE_LEAVE:
                if( item ){
                    $.pubsub.publish( 'ronin.model.reset', item._id );
                }
                switch( g.run.layout.get()){
                    case LYT_PAGE:
                        FlowRouter.go( g.run.back );
                        break;
                    case LYT_WINDOW:
                        $().IWindowed.close( '.thought-panel' );
                        break;
                }
                break;
            // successful insert operation, stay in the page and reinitialize fields
            case DBOPE_REINIT:
                Template.thought_panel.fn.initEditArea();
                break;
        }
        Session.set( 'collect.dbope', null );
    });
});

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
