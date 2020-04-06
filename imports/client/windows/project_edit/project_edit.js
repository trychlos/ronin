/*
 * 'projectEdit' window.
 *
 *  This page lets the user edit a project.
 *  This very same window may be used:
 *
 *  - from the 'process' features group, to insert a new project
 *      > page layout: this is tied to the 'projects' group
 *
 *  - from the 'collect' features group, to transform a thought into a project
 *      > page layout: this is tied to the 'thoughts' group
 *
 *  - from the 'review' features group, to edit a project
 *      > page layout: this is tied to the 'projects' group
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
 *  - the action identifier to be edited is specified as the 'id' queryParams.
 */
import { ActionStatus } from 'meteor/pwi:ronin-action-status';
import { Articles } from '/imports/api/collections/articles/articles.js';
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/project_panel/project_panel.js';
import '/imports/client/components/wsf_collapse_buttons/wsf_collapse_buttons.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './project_edit.html';

Template.projectEdit.fn = {
    doClose: function( instance ){
        $().IWindowed.pageClose( instance.ronin.$dom );
    },
    // convert from action
    convertFromAction: function( item ){
        if( item.type === 'A' ){
            if( item.notes ){
                item.notes += '\n';
            } else {
                item.notes = '';
            }
            item.notes += 'Status: '+ActionStatus.labelById( item.status );
            item.status = null;
            item.last_status = null;
            if( item.context ){
                const context = Contexts.findOne({ _id:item.context });
                if( context ){
                    item.notes += '\n';
                    item.notes += 'Context: '+context.name;
                }
                item.context = null;
            }
            if( item.outcome ){
                item.notes += '\n';
                item.notes += 'Outcome: '+item.outcome;
                item.outcome = null;
            }
        }
    },
    // this let us close a projectEdit window if the project has been
    //  transformed in something else elsewhere
    forClose: function( msg, o ){
        const self = Template.instance();
        if( self && self.ronin.dict.get( 'got' )){
            console.log( 'projectEdit '+msg+' '+o._id );
            const item = self.ronin.dict.get( 'item' );
            if( item._id === o._id ){
                Template.projectEdit.fn.doClose( self );
            }
        }
    },
    okLabel: function(){
        const self = Template.instance();
        const item = self.ronin.dict.get( 'item' );
        return Template.projectEdit.fn.okLabelItem( item );
    },
    okLabelItem: function( it ){
        return it ? ( it.type === 'T' || it.type === 'A' ? 'Transform' : 'Update' ) : 'Create';
    },
    // this function is to be called after model update, with a three states qualifier
    updateCb: function( instance, o ){
        if( instance ){
            switch( o.status ){
                // successful update, leave the page
                case DBOPE_LEAVE:
                    Template.actionEdit.fn.doClose( instance );
                    break;
                // successful insert, reinit the page
                case DBOPE_REINIT:
                    Template.action_panel.fn.initEditArea( instance.ronin.$dom );
                    break;
                // all other cases, stay in the page letting it unchanged
            }
        }
    }
}

Template.projectEdit.onCreated( function(){
    //console.log( 'projectEdit.onCreated' );
    this.ronin = {
        dict: new ReactiveDict(),
        $dom: null,
        handles: {
            article: this.subscribe( 'articles.one', FlowRouter.getQueryParam( 'id' )),
            projects: this.subscribe( 'articles.projects.all' ),
            topics: this.subscribe( 'topics.all' ),
            context: this.subscribe( 'contexts.all' )
        }
    };
    this.ronin.dict.set( 'item', null );
    this.ronin.dict.set( 'got', false );
});

Template.projectEdit.onRendered( function(){
    const self = this;
    const fn = Template.projectEdit.fn;
    const context = Template.currentData();
    self.ronin.$dom = self.$( '.'+context.template );

    // get the edited item
    this.autorun(() => {
        if( self.ronin.handles.article.ready() && !self.ronin.dict.get( 'got' )){
            const id = FlowRouter.getQueryParam( 'id' );
            if( id ){
                const item = Articles.findOne({ _id:id });
                if( item ){
                    if( item.type === 'A' ){
                        fn.convertFromAction( item );
                    }
                    self.ronin.dict.set( 'item', item );
                }
            }
            self.ronin.dict.set( 'got', true );
        }
    });

    // open the window if the manager has been initialized
    this.autorun(() => {
        if( Ronin.ui.layouts[LYT_WINDOW].taskbar.get() && self.ronin.dict.get( 'got' )){
            const label = fn.okLabel();
            self.ronin.$dom.IWindowed({
                template: context.template,
                simone: {
                    buttons: [
                        {
                            text: "Cancel",
                            click: function(){
                                fn.doClose( self );
                            }
                        },
                        {
                            text: label,
                            click: function(){
                                $.pubsub.publish( 'ronin.model.project.update', {
                                    orig: self.ronin.dict.get( 'item' ),
                                    edit: Template.project_panel.fn.getContent( self.ronin.$dom ),
                                    cb: fn.updateCb,
                                    data: self
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

    // this let us close a projectEdit window if the item has been
    //  transformed in something else elsewhere
    $.pubsub.subscribe( 'ronin.ui.item.deleted', ( msg, o ) => {
        fn.forClose( msg, o );
    });
    $.pubsub.subscribe( 'ronin.ui.item.transformed', ( msg, o ) => {
        fn.forClose( msg, o );
    });
});

Template.projectEdit.helpers({
    item(){
        const self = Template.instance();
        return self.ronin.dict.get( 'item' );
    },
    okLabel(){
        return Template.projectEdit.fn.okLabel();
    },
    title(){
        const self = Template.instance();
        const item = self.ronin.dict.get( 'item' );
        const title = item ?
            ( item.type === 'T' ? 'Transform to project' :
            ( item.type === 'A' ? 'Transform to project' : 'Edit project' )) : 'New project';
        Session.set( 'header.title', title );
        return title;
    }
});

Template.projectEdit.events({
    'click .js-cancel'( ev, instance ){
        Template.projectEdit.fn.doClose( instance );
        return false;
    },
    'click .js-ok'( ev, instance ){
        $.pubsub.publish( 'ronin.model.project.update', {
            orig: instance.ronin.dict.get( 'item' ),
            edit: Template.project_panel.fn.getContent( instance.ronin.$dom ),
            cb: Template.projectEdit.fn.updateCb,
            data: instance
        });
        return false;
    }
});
