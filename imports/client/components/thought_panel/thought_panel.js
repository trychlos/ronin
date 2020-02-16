/*
 * 'thought_panel' component.
 *
 *  A collapsable panel which let the user:
 *  - enter a new thought (if session/collect.thought is empty)
 *  - or edit an existing one (if session/collect.thought already exists).
 *
 *  Session variable:
 *  - collect.thought: the thought being edited, may be null.
 *
 *  Parameters:
 *  - collapsable=true|false whether this component may be collapsed
 *      defaulting to false.
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
        return {
            type: 'T',
            name: $('.js-name').val(),
            description: $('.js-description').val(),
            topic: Template.topics_select.fn.getSelected()
        }
    },
    // initialize the edition area
    // this is needed when we cancel a current creation
    //  as this will not change the collect.thought session variable
    //  no helper is triggered,
    //  and we have to manually reinit the fields
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
    this.autorun(() => {
        const status = Session.get( 'collect.dbope' );
        switch( status ){
            // successful update operation, leave the page
            case DBOPE_LEAVE:
                Session.set( 'collect.thought', null );
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
                Session.set( 'collect.thought', null );
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
        return Session.get( 'collect.thought' ) ? '' : 'Description of the new thought';
    },
    descriptionValue(){
        const obj = Session.get( 'collect.thought' );
        return obj ? obj.description : '';
    },
    namePlaceholder(){
        return Session.get( 'collect.thought' ) ? '' : 'Type to add new thought';
    },
    nameValue(){
        const obj = Session.get( 'collect.thought' );
        return obj ? obj.name : '';
    },
    topic(){
        const obj = Session.get( 'collect.thought' );
        return obj ? obj.topic : null;
    }
});
