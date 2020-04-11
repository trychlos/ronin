/*
 * 'device_tabs' component.
 *
 *  Display a tab per type of information:
 *  - Ronin.ui.detectIt
 *  - Ronin.ui.runContext
 *  - Meteor.status.
 *
 *  As we have a single menu entry, a single route is attributed to the whole
 * 'device_tabs' component. A dedicated session variable keeps trace of the last
 *  displayed tab, but the route itself is kept constant.
 *
 *  Parameters:
 *  - 'data': the layout context built in appLayout, and passed in by group layer.
 *
 *  Session variables:
 *  - device.tab.name: the identifier of the active tab.
 */
import '/imports/client/components/device_detect/device_detect.js';
import '/imports/client/components/device_perms/device_perms.js';
import '/imports/client/components/device_run/device_run.js';
import '/imports/client/components/device_status/device_status.js';
import '/imports/client/interfaces/itabbed/itabbed.js';
import './device_tabs.html';

Template.device_tabs.fn = {
    tabs: [
        {
            id: 'detect',
            component: 'device_detect',
            label: 'detectIt'
        },
        {
            id: 'run',
            component: 'device_run',
            label: 'runContext'
        },
        {
            id: 'status',
            component: 'device_status',
            label: 'Status'
        },
        {
            id: 'perms',
            component: 'device_perms',
            label: 'Permissions'
        }
    ]
};

Template.device_tabs.onRendered( function(){
    this.autorun(() => {
        $( '.device-tabs' ).ITabbed({
            tab: Session.get( 'device.tab.name' )
        });
    });
    // this is needed because we do not have a route per tab
    $( '.device-tabs' ).on( 'ronin-itabbed-clicked', function( ev, o ){
        Session.set( 'device.tab.name', o.name );
    });
});

Template.device_tabs.helpers({
    tabsList(){
        return Template.device_tabs.fn.tabs;
    },
    route(){
        return FlowRouter.getRouteName();
    }
});
