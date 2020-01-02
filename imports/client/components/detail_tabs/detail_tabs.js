/*
 * 'detail_tabs' component.
 *  Edit projects and actions as tabs.
 * 
 *  Session variables:
 *  - review.detail.obj: the current object.
 */
import '/imports/client/components/action_edit/action_edit.js';
import '/imports/client/components/project_edit/project_edit.js';
import '/imports/client/interfaces/itabbed/itabbed.js';
import './detail_tabs.html';

Template.detail_tabs.fn = {
    tabs: [
        { tab: 'action',    label: 'Action',    template: 'action_edit' },
        { tab: 'project',   label: 'Project',   template: 'project_edit' }
    ]
}

Template.detail_tabs.onRendered( function(){
    this.autorun(() => {
        const obj = Session.get('review.detail.obj');
        const type = obj ? obj.type : 'P';
        let tab = 'project';
        if( type === 'A' ){
            tab = 'action';
        }
        $('.detail-tabbed').ITabbed({
            tab: tab
        });
    });
});

Template.detail_tabs.helpers({
    tabs(){
        return Template.detail_tabs.fn.tabs;
    }
});
