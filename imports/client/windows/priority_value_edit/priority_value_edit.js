/*
 * 'priorityValueEdit' window.
 *
 *  This page lets the user edit a priority value.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> <app layout layer> { gtdid, group, template }
 *              +-> <group layer> { gtdid, group, template }
 *                      |
 *                      +-> priorityValueEdit { gtdid, group, template }
 *                      |       +-> priorityValue_panel
 *                      |       +-> wsf_collapse_buttons
 *                      |
 *                      +-> projectEdit { gtdid, group, template }
 *
 *  Variables:
 *  - the item identifier to be edited is specified as the 'id' queryParams.
 */
import { PriorityValues } from '/imports/api/collections/priority_values/priority_values.js';
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/priority_value_panel/priority_value_panel.js';
import '/imports/client/components/wsf_collapse_buttons/wsf_collapse_buttons.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './priority_value_edit.html';

Template.priorityValueEdit.fn = {
    doClose( instance ){
        $().IWindowed.pageClose( instance.ronin.$dom );
    },
    // this let us close an priorityValueEdit window if the priorityValue has been
    //  transformed in something else elsewhere
    forClose: function( msg, o ){
        const fn = Template.priorityValueEdit.fn;
        const self = Template.instance();
        if( self && self.ronin.dict.get( 'got' )){
            console.log( 'priorityValueEdit '+msg+' '+o._id );
            const item = self.ronin.dict.get( 'item' );
            if( item._id === o._id ){
                fn.doClose( self );
            }
        }
    },
    okLabel: function(){
        const self = Template.instance();
        const item = self.ronin.dict.get( 'item' );
        return Template.priorityValueEdit.fn.okLabelItem( item );
    },
    okLabelItem: function( it ){
        return it ? 'Update' : 'Create';
    },
    // this function is to be called after model update, with a three states qualifier
    updateCb: function( instance, o ){
        //console.log( 'updateCb instance='+instance+' status='+o.status );
        if( instance ){
            switch( o.status ){
                // successful update, leave the page
                case DBOPE_LEAVE:
                    Template.priorityValueEdit.fn.doClose( instance );
                    break;
                // successful insert, reinit the page
                case DBOPE_REINIT:
                    Template.priority_value_panel.fn.initEditArea( instance.ronin.$dom );
                    break;
                // all other cases, stay in the page letting it unchanged
            }
        }
    }
}

Template.priorityValueEdit.onCreated( function(){
    this.ronin = {
        dict: new ReactiveDict(),
        $dom: null,
        handle: this.subscribe( 'priority_values.all' )
    };
    this.ronin.dict.set( 'item', null );
    this.ronin.dict.set( 'got', false );
});

Template.priorityValueEdit.onRendered( function(){
    const self = this;
    const fn = Template.priorityValueEdit.fn;
    const context = Template.currentData();
    self.ronin.$dom = self.$( '.'+context.template );

    // get the edited item
    // the rest of the application will not work correctly else
    this.autorun(() => {
        if( self.ronin.handle.ready() && !self.ronin.dict.get( 'got' )){
            const id = FlowRouter.getQueryParam( 'id' );
            if( id ){
                const item = PriorityValues.findOne({ _id:id });
                if( item ){
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
                                $.pubsub.publish( 'ronin.model.priority_value.update', {
                                    orig: self.ronin.dict.get( 'item' ),
                                    edit: Template.priority_value_panel.fn.getContent( self.ronin.$dom ),
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

    // this let us close a thoughtEdit window if the thought has been
    //  transformed in something else elsewhere
    $.pubsub.subscribe( 'ronin.ui.item.deleted', ( msg, o ) => {
        fn.forClose( msg, o );
    });
});

Template.priorityValueEdit.helpers({
    item(){
        const self = Template.instance();
        return self.ronin.dict.get( 'item' );
    },
    okLabel(){
        return Template.priorityValueEdit.fn.okLabel();
    },
    title(){
        const self = Template.instance();
        const item = self.ronin.dict.get( 'item' );
        const title = item ? 'Edit priority value' : 'New priority value';
        Session.set( 'header.title', title );
        return title;
    }
});

Template.priorityValueEdit.events({
    'click .js-cancel'( ev, instance ){
        Template.priorityValueEdit.fn.doClose( instance );
        return false;
    },
    'click .js-ok'( ev, instance ){
        $.pubsub.publish( 'ronin.model.priority_value.update', {
            orig: instance.ronin.dict.get( 'item' ),
            edit: Template.priorityValue_panel.fn.getContent( instance.ronin.$dom ),
            cb: Template.priorityValueEdit.fn.updateCb,
            data: instance
        });
        return false;
    }
});
