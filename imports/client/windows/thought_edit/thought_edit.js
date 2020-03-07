/*
 * 'thoughtEdit' window.
 *
 *  This page lets the user edit a thought.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> <app layout layer> { gtdid, group, template }
 *              +-> <group layer> { gtdid, group, template }
 *                      |
 *                      +-> thoughtsList { gtdid, group, template }
 *                              +-> thought_panel in window-based layout
 *                              +-> thoughts_list
 *                              +-> plus_button in page-based layout
 *                      |
 *                      +-> thoughtEdit { gtdid, group, template }
 *
 *  Parameters:
 *  - 'data': the layout context built in appLayout, and passed in by group layer.
 *
 *  Variables:
 *  - the item identifier to be edited is specified as the 'id' queryParams.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/api/resources/dbope_status/dbope_status.js';
import '/imports/client/components/wsf_collapse_buttons/wsf_collapse_buttons.js';
import '/imports/client/components/thought_panel/thought_panel.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './thought_edit.html';

Template.thoughtEdit.fn = {
    // on close, go back to thoughtsList window
    actionClose: function(){
        //console.log( 'Template.thoughtEdit.fn.actionClose' );
        switch( g.run.layout.get()){
            case LYT_PAGE:
                FlowRouter.go( g.run.back );
                break;
            case LYT_WINDOW:
                $().IWindowed.close( '.thoughtEdit' );
                break;
        }
    },
    // an item has been deleted or has been transformed
    //  should we close this window ?
    forClose: function( msg, o ){
        const self = Template.instance();
        if( self.ronin.get( 'got' )){
            console.log( 'thoughtEdit '+msg+' '+o._id );
            const item = self.ronin.get( 'item' );
            if( item._id === o._id ){
                Template.thoughtEdit.fn.actionClose();
            }
        }
    },
    okLabel: function(){
        const self = Template.instance();
        const item = self.ronin.get( 'item' );
        return Template.thoughtEdit.fn.okLabelItem( item );
    },
    okLabelItem: function( it ){
        return it ? 'Update' : 'Create';
    }
}

Template.thoughtEdit.onCreated( function(){
    //console.log( 'thoughtEdit.onCreated' );
    this.subscribe( 'articles.thoughts.all' );
    this.subscribe( 'topics.all' );

    this.ronin = new ReactiveDict();
    this.ronin.set( 'got', false );
});

Template.thoughtEdit.onRendered( function(){
    //console.log( 'thoughtEdit.onRendered' );
    const self = this;
    const fn = Template.thoughtEdit.fn;

    // get the edited item
    this.autorun(() => {
        if( !self.ronin.get( 'got' )){
            const id = FlowRouter.getQueryParam( 'id' );
            if( id ){
                const item = Articles.findOne({ _id:id });
                if( item ){
                    self.ronin.set( 'item', item );
                    self.ronin.set( 'got', true );
                }
            } else {
                self.ronin.set( 'got', true );
            }
        }
    });

    // open the window if the manager has been initialized
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            const context = Template.currentData();
            const label = fn.okLabel();
            $( '.'+context.template ).IWindowed({
                template: context.template,
                simone: {
                    buttons: [
                        {
                            text: "Cancel",
                            click: function(){
                                fn.actionClose();
                            }
                        },
                        {
                            text: label,
                            click: function(){
                                $.pubsub.publish( 'ronin.model.thought.update', {
                                    orig: self.ronin.get( 'item' ),
                                    edit: Template.thought_panel.fn.getContent()
                                });
                            }
                        }
                    ],
                    group:  context.group,
                    title:  gtd.labelId( null, context.gtdid )
                }
            });
        }
    });

    // this let us close a thoughtEdit window if the thought has been
    //  transformed in something else elsewhere
    $.pubsub.subscribe( 'ronin.ui.item.deleted', ( msg, o ) => {
        Template.thoughtEdit.fn.forClose( msg, o );
    });
    $.pubsub.subscribe( 'ronin.ui.item.transformed', ( msg, o ) => {
        Template.thoughtEdit.fn.forClose( msg, o );
    });
});

Template.thoughtEdit.helpers({
    okLabel(){
        return Template.thoughtEdit.fn.okLabel();
    },
    thought(){
        const self = Template.instance();
        return self.ronin.get( 'item' );
    },
    title(){
        const self = Template.instance();
        const item = self.ronin.get( 'item' );
        const title = item ? 'Edit thought' : 'New thought';
        Session.set( 'header.title', title );
        return title;
    }
});

Template.thoughtEdit.events({
    // wsf_collapse_buttons cancel button
    'click .js-cancel': function( ev, instance ){
        Template.thoughtEdit.fn.actionClose();
        return false;
    },
    // wsf_collapse_buttons ok button
    'click .js-ok': function( ev, instance ){
        $.pubsub.publish( 'ronin.model.thought.update', {
            orig: instance.ronin.get( 'item' ),
            edit: Template.thought_panel.fn.getContent()
        });
        return false;
    }
});

Template.thoughtEdit.onDestroyed( function(){
    //console.log( 'thoughtEdit.onDestroyed' );
});
