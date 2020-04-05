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
    doClose(){
        //console.log( 'Template.actionEdit.fn.doClose' );
        switch( Ronin.ui.runLayout()){
            case LYT_PAGE:
                FlowRouter.go( Ronin.ui.runBack());
                break;
            case LYT_WINDOW:
                $().IWindowed.close( '.apkWindow' );
                break;
        }
    }
};

Template.apkWindow.onRendered( function(){
    const fn = Template.apkWindow.fn;
    this.autorun(() => {
        if( Ronin.ui.layouts[LYT_WINDOW].taskbar.get()){
            const context = Template.currentData();
            $( '.'+context.template ).IWindowed({
                template: context.template,
                simone: {
                    buttons: [
                        {
                            text: "Close",
                            click: function(){
                                fn.doClose();
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
        Template.apkWindow.fn.doClose();
        return false;
    }
});
