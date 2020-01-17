/*
 * 'actionsWindow' window.
 *  This is the main component for actions and actions reviewing.
 *  This is a tabbed window: routable informations are set at the tab level.
 */
import '/imports/client/components/actions_tabs/actions_tabs.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './actions_window.html';

Template.actionsWindow.onRendered( function(){
    this.autorun(() => {
        if( g[LYT_DESKTOP].taskbar.get()){
            $('div.actions-window').IWindowed({
                template:   'actionsWindow',
                group:      'reviewWindow',
                title:      'Review, organize and do - Actions'
            });
        }
    });
});
