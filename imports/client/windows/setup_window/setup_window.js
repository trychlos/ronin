/*
 * 'setupWindow' window.
 *  Embeds the tabbed 'setup_tab' component.
 * 
 *  NB: because the setup_tab is dynamically built from gtd.features(),
 *  we cannot subscribe from the window and pass the cursors to each tab.
 *  Instead, each tab is independant: subscribe to its own datas, and
 *  manages its own cursor.
 */
import '/imports/client/components/setup_tabs/setup_tabs.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './setup_window.html';

Template.setupWindow.onRendered( function(){
    this.autorun(() => {
        if( g.taskbar.get()){
            $('div.setup-window').IWindowed({
                id:    'setupWindow',
                title: 'Setup'
            });
        }
    });
});
