/*
 * 'deviceWindow' window.
 *  Displays device informations.
 */
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/device_panel/device_panel.js';
import '/imports/client/components/wsf_collapse_buttons/wsf_collapse_buttons.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './device_window.html';

Template.deviceWindow.fn = {
    doClose(){
        //console.log( 'Template.actionEdit.fn.doClose' );
        switch( g.run.layout.get()){
            case LYT_PAGE:
                FlowRouter.go( g.run.back );
                break;
            case LYT_WINDOW:
                $().IWindowed.close( '.deviceWindow' );
                break;
        }
    }
};

Template.deviceWindow.onRendered( function(){
    const fn = Template.deviceWindow.fn;
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
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

Template.deviceWindow.events({
    'click .js-cancel'( ev, instance ){
        Template.deviceWindow.fn.doClose();
        return false;
    }
});
