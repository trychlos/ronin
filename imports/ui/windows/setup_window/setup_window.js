/*
 * 'setupWindow' window.
 *  Embeds the tabbed 'setup_tab' component.
 */
import '/imports/ui/components/setup_tab/setup_tab.js';
import '/imports/ui/interfaces/iwindowed/iwindowed.js';
import './setup_window.html';

Template.setupWindow.onRendered( function(){
    this.autorun(() => {
        if( g.taskbar.get()){
            $('div.setup-window').iWindowed({
                id:    'setupWindow',
                title: 'Setup'
            });
        }
    });
});
