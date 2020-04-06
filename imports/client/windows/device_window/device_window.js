/*
 * 'deviceWindow' window.
 *  Displays device informations.
 */
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/device_tabs/device_tabs.js';
import '/imports/client/components/wsf_collapse_buttons/wsf_collapse_buttons.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './device_window.html';

Template.deviceWindow.fn = {
    doClose( instance ){
        $().IWindowed.pageClose( instance.ronin.$dom );
    }
};

Template.deviceWindow.onCreated( function(){
    this.ronin = {
        $dom: null
    };
});

Template.deviceWindow.onRendered( function(){
    const self = this;
    const fn = Template.apkWindow.fn;
    const context = Template.currentData();
    self.ronin.$dom = self.$( '.'+context.template );

    this.autorun(() => {
        if( Ronin.ui.layouts[LYT_WINDOW].taskbar.get()){
            self.ronin.$dom.IWindowed({
                template: context.template,
                simone: {
                    buttons: [
                        {
                            text: "Close",
                            click: function(){
                                fn.doClose( self );
                            }
                        }
                    ],
                    group: context.group,
                    title: gtd.labelId( null, context.gtdid )
                }
            });
        }
    });
});

Template.deviceWindow.events({
    'click .js-cancel'( ev, instance ){
        Template.deviceWindow.fn.doClose( instance );
        return false;
    }
});
