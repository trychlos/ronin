/*
 * 'actionEdit' window.
 *
 *  This page lets the user edit an action.
 *  This very same window may be used:
 *
 *  - from the 'process' features group, to insert a new action
 *      > page layout: this is tied to the 'actions' group
 *
 *  - from the 'collect' features group, to transform a thought into an action
 *      > page layout: this is tied to the 'thoughts' group
 *
 *  - from the 'review' features group, to edit an action
 *      > page layout: this is tied to the 'actions' group
 *
 *  Worflow:
 *  [routes.js]
 *      +-> <app layout layer> { gtdid, group, template }
 *              +-> <group layer> { gtdid, group, template }
 *                      |
 *                      +-> actionEdit { gtdid, group, template }
 *                      |       +-> action_panel
 *                      |       +-> wsf_collapse_buttons
 *                      |
 *                      +-> projectEdit { gtdid, group, template }
 *
 *  Variables:
 *  - the item identifier to be edited is specified as the 'id' queryParams;
 *      may be a thought or an action, or even not exists at all.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/wsf_collapse_buttons/wsf_collapse_buttons.js';
import '/imports/client/components/action_panel/action_panel.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './action_edit.html';

Template.actionEdit.fn = {
    doClose: function(){
        //console.log( 'Template.actionEdit.fn.doClose' );
        switch( g.run.layout.get()){
            case LYT_PAGE:
                FlowRouter.go( g.run.back );
                break;
            case LYT_WINDOW:
                $().IWindowed.close( '.actionEdit' );
                break;
        }
    },
    // this let us close an actionEdit window if the action has been
    //  transformed in something else elsewhere
    forClose: function( msg, o ){
        const fn = Template.actionEdit.fn;
        const self = Template.instance();
        if( self && self.ronin.dict.get( 'got' )){
            console.log( 'actionEdit '+msg+' '+o._id );
            const item = self.ronin.dict.get( 'item' );
            if( item._id === o._id ){
                fn.doClose();
            }
        }
    },
    okLabel: function(){
        const self = Template.instance();
        const item = self.ronin.dict.get( 'item' );
        return Template.actionEdit.fn.okLabelItem( item );
    },
    okLabelItem: function( it ){
        return it ? ( it.type === 'T' ? 'Transform' : 'Update' ) : 'Create';
    }
}

Template.actionEdit.onCreated( function(){
    this.ronin = {
        dict: new ReactiveDict(),
        handles: {
            actions: this.subscribe( 'articles.actions.all' ),
            projects: this.subscribe( 'articles.projects.all' ),
            topics: this.subscribe( 'topics.all' ),
            context: this.subscribe( 'contexts.all' )
        }
    };
    this.ronin.dict.set( 'item', null );
    this.ronin.dict.set( 'got', false );
});

Template.actionEdit.onRendered( function(){
    const self = this;
    const fn = Template.actionEdit.fn;

    // get the edited item
    // the rest of the application will not work correctly
    this.autorun(() => {
        if( !self.ronin.dict.get( 'got' ) && self.ronin.handles.actions.ready()){
            const id = FlowRouter.getQueryParam( 'id' );
            if( id ){
                const item = Articles.findOne({ _id:id });
                if( item ){
                    self.ronin.dict.set( 'item', item );
                }
            }
            self.ronin.dict.set( 'got', true );
        }
    });

    // open the window if the manager has been initialized
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get() && self.ronin.dict.get( 'got' )){
            const context = Template.currentData();
            const label = fn.okLabel();
            $( '.'+context.template ).IWindowed({
                template: context.template,
                simone: {
                    buttons: [
                        {
                            text: "Cancel",
                            click: function(){
                                fn.doClose();
                            }
                        },
                        {
                            text: label,
                            click: function(){
                                $.pubsub.publish( 'ronin.model.action.update', {
                                    orig: self.ronin.dict.get( 'item' ),
                                    edit: Template.action_panel.fn.getContent()
                                });
                            }
                        }
                    ],
                    group: context.group,
                    title: gtd.labelId( null, context.gtdid )
                }
            });
        }
    });

    // this let us close a thoughtEdit window if the thought has been
    //  transformed in something else elsewhere
    $.pubsub.subscribe( 'ronin.ui.item.deleted', ( msg, o ) => {
        fn.forClose( msg, o );
    });
    $.pubsub.subscribe( 'ronin.ui.item.transformed', ( msg, o ) => {
        fn.forClose( msg, o );
    });
});

Template.actionEdit.helpers({
    action(){
        const self = Template.instance();
        return self.ronin.dict.get( 'item' );
    },
    okLabel(){
        return Template.actionEdit.fn.okLabel();
    },
    title(){
        const self = Template.instance();
        const item = self.ronin.dict.get( 'item' );
        const title = item ? ( item.type === 'T' ? 'Transform thought' : 'Edit action' ) : 'New action';
        Session.set( 'header.title', title );
        return title;
    }
});

Template.actionEdit.events({
    'click .js-cancel'( ev, instance ){
        Template.actionEdit.fn.doClose();
        return false;
    },
    'click .js-ok'( ev, instance ){
        $.pubsub.publish( 'ronin.model.action.update', {
            orig: instance.ronin.dict.get( 'item' ),
            edit: Template.action_panel.fn.getContent()
        });
        return false;
    }
});
