/*
 * 'apkWindow' window.
 *
 *  Let the user download last-1 Android APK.
 */
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/apk_panel/apk_panel.js';
import '/imports/client/components/wsf_collapse_buttons/wsf_collapse_buttons.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './apk_window.html';

Template.apkWindow.fn = {
    doClose( instance ){
        $().IWindowed.pageClose( instance.ronin.$dom );
    }
};

Template.apkWindow.onCreated( function(){
    this.ronin = {
        $dom: null
    };
});

Template.apkWindow.onRendered( function(){
    const self = this;
    const fn = Template.apkWindow.fn;
    const context = Template.currentData();
    self.ronin.$dom = self.$( '.'+context.template );

    this.autorun(() => {
        if( Ronin.ui.layouts[R_LYT_WINDOW].taskbar.get()){
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

Template.apkWindow.events({
    'click .js-cancel'( ev, instance ){
        Template.apkWindow.fn.doClose( instance );
        return false;
    }
});
