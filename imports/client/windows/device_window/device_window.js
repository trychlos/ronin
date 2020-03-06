/*
 * 'deviceWindow' window.
 *  Displays device informations.
 */
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/device_panel/device_panel.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './device_window.html';

Template.deviceWindow.onRendered( function(){
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
                                $().IWindowed.close( '.'+context.template );
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
