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
import { Articles } from '/imports/api/collections/articles/articles.js';
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/wsf_collapse_buttons/wsf_collapse_buttons.js';
import '/imports/client/components/project_panel/project_panel.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './project_edit.html';

Template.projectEdit.fn = {
    actionClose(){
        //console.log( 'Template.projectEdit.fn.actionClose' );
        switch( g.run.layout.get()){
            case LYT_PAGE:
                FlowRouter.go( g.run.back );
                break;
            case LYT_WINDOW:
                $().IWindowed.close( '.projectEdit' );
                break;
        }
    },
    okLabel: function(){
        const self = Template.instance();
        const item = self.ronin.get( 'item' );
        return Template.projectEdit.fn.okLabelItem( item );
    },
    okLabelItem: function( it ){
        return it ? ( it.type === 'T' ? 'Transform' : 'Update' ) : 'Create';
    }
}

Template.projectEdit.onCreated( function(){
    //console.log( 'projectEdit.onCreated' );
    this.subscribe( 'articles.actions.all' );
    this.subscribe( 'articles.projects.all' );
    this.subscribe( 'topics.all' );
    this.subscribe( 'contexts.all' );

    this.ronin = new ReactiveDict();
    this.ronin.set( 'got', false );
});

Template.projectEdit.onRendered( function(){
    const self = this;

    // get the edited item
    // the rest of the application will not work correctly
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

    // this let us close a projectEdit window if the project has been
    //  transformed in something else elsewhere
    this.autorun(() => {
        if( self.ronin.get( 'got' )){
            $.pubsub.subscribe( 'ronin.ui.action.close', ( msg, o ) => {
                console.log( 'projectEdit '+msg+' '+o._id );
                const item = self.ronin.get( 'item' );
                if( item._id === o._id ){
                    Template.projectEdit.fn.actionClose();
                }
            });
        }
    });

    // open the window if the manager has been initialized
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            const context = Template.currentData();
            const label = Template.projectEdit.fn.okLabel();
            $( '.'+context.template ).IWindowed({
                template: context.template,
                simone: {
                    buttons: [
                        {
                            text: "Close",
                            click: function(){
                                Template.projectEdit.fn.actionClose();
                            }
                        },
                        {
                            text: label,
                            click: function(){
                                $.pubsub.publish( 'ronin.model.project.update', {
                                    orig: self.ronin.get( 'item' ),
                                    edit: Template.project_panel.fn.getContent()
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
});

Template.projectEdit.helpers({
    project(){
        const self = Template.instance();
        return self.ronin.get( 'item' );
    },
    okLabel(){
        return Template.projectEdit.fn.okLabel();
    },
    title(){
        const self = Template.instance();
        const item = self.ronin.get( 'item' );
        const title = item ? 'Edit project' : ( item.type === 'T' ? 'Transform thought' : 'New project' );
        Session.set( 'header.title', title );
        return title;
    }
});

Template.projectEdit.events({
    'click .js-cancel'( ev, instance ){
        Template.projectEdit.fn.actionClose();
        return false;
    },
    'click .js-ok'( ev, instance ){
        $.pubsub.publish( 'ronin.model.project.update', {
            orig: instance.ronin.get( 'item' ),
            edit: Template.project_panel.fn.getContent()
        });
        return false;
    }
});
