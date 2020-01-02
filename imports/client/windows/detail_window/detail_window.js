/*
 * 'detailWindow' window.
 *  This is the main component for projects and actions edition.
 */
import '/imports/client/components/detail_tabs/detail_tabs.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './detail_window.html';

Template.detailWindow.onRendered( function(){
    this.autorun(() => {
        if( g.taskbar.get()){
            $('div.detail-window').IWindowed({
                template:   'detailWindow',
                group:      'reviewWindow',
                title:      'Edit'
            });
        }
    });
});
