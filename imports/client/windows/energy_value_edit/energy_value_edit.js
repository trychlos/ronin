/*
 * 'energyValueEdit' window.
 *
 *  This page lets the user edit a energy value.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> <app layout layer> { gtdid, group, template }
 *              +-> <group layer> { gtdid, group, template }
 *                      |
 *                      +-> energyValueEdit { gtdid, group, template }
 *                      |       +-> energyValue_panel
 *                      |       +-> wsf_collapse_buttons
 *                      |
 *                      +-> projectEdit { gtdid, group, template }
 *
 *  Variables:
 *  - the item identifier to be edited is specified as the 'id' queryParams.
 */
import { EnergyValues } from '/imports/api/collections/energy_values/energy_values.js';
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/energy_value_panel/energy_value_panel.js';
import '/imports/client/components/wsf_collapse_buttons/wsf_collapse_buttons.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './energy_value_edit.html';

Template.energyValueEdit.fn = {
    doClose: function( instance ){
        //console.log( 'Template.energyValueEdit.fn.doClose instance='+instance );
        switch( g.run.layout.get()){
            case LYT_PAGE:
                FlowRouter.go( g.run.back );
                break;
            case LYT_WINDOW:
                instance.ronin.$dom.IWindowed( 'close' );
                break;
        }
    },
    // this let us close an energyValueEdit window if the energyValue has been
    //  transformed in something else elsewhere
    forClose: function( msg, o ){
        const fn = Template.energyValueEdit.fn;
        const self = Template.instance();
        if( self && self.ronin.dict.get( 'got' )){
            console.log( 'energyValueEdit '+msg+' '+o._id );
            const item = self.ronin.dict.get( 'item' );
            if( item._id === o._id ){
                fn.doClose( self );
            }
        }
    },
    okLabel: function(){
        const self = Template.instance();
        const item = self.ronin.dict.get( 'item' );
        return Template.energyValueEdit.fn.okLabelItem( item );
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
                    Template.energyValueEdit.fn.doClose( instance );
                    break;
                // successful insert, reinit the page
                case DBOPE_REINIT:
                    Template.energy_value_panel.fn.initEditArea( instance.ronin.$dom );
                    break;
                // all other cases, stay in the page letting it unchanged
            }
        }
    }
}

Template.energyValueEdit.onCreated( function(){
    this.ronin = {
        dict: new ReactiveDict(),
        handle: this.subscribe( 'energy_values.all' ),
        $dom: null
    };
    this.ronin.dict.set( 'item', null );
    this.ronin.dict.set( 'got', false );
});

Template.energyValueEdit.onRendered( function(){
    const self = this;
    const fn = Template.energyValueEdit.fn;

    // stores this $DOM window element
    self.ronin.$dom = self.$( '.energyValueEdit' );

    // get the edited item
    // the rest of the application will not work correctly else
    this.autorun(() => {
        if( self.ronin.handle.ready() && !self.ronin.dict.get( 'got' )){
            const id = FlowRouter.getQueryParam( 'id' );
            if( id ){
                const item = EnergyValues.findOne({ _id:id });
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
            const energyValue = Template.currentData();
            const label = fn.okLabel();
            self.ronin.$dom.IWindowed({
                template: energyValue.template,
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
                                $.pubsub.publish( 'ronin.model.energy_value.update', {
                                    orig: self.ronin.dict.get( 'item' ),
                                    edit: Template.energy_value_panel.fn.getContent( self.ronin.$dom ),
                                    cb: fn.updateCb,
                                    data: self
                                });
                            }
                        }
                    ],
                    group: energyValue.group,
                    title: gtd.labelId( null, energyValue.gtdid )
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

Template.energyValueEdit.helpers({
    item(){
        const self = Template.instance();
        return self.ronin.dict.get( 'item' );
    },
    okLabel(){
        return Template.energyValueEdit.fn.okLabel();
    },
    title(){
        const self = Template.instance();
        const item = self.ronin.dict.get( 'item' );
        const title = item ? 'Edit energy value' : 'New energy value';
        Session.set( 'header.title', title );
        return title;
    }
});

Template.energyValueEdit.events({
    'click .js-cancel'( ev, instance ){
        Template.energyValueEdit.fn.doClose( instance );
        return false;
    },
    'click .js-ok'( ev, instance ){
        $.pubsub.publish( 'ronin.model.energy_value.update', {
            orig: instance.ronin.dict.get( 'item' ),
            edit: Template.energyValue_panel.fn.getContent( instance.ronin.$dom ),
            cb: Template.energyValueEdit.fn.updateCb,
            data: instance
        });
        return false;
    }
});
