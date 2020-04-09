/*
 * /imports/startup/client/routes.js
 */
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/layouts/app_layout/app_layout.js';
import '/imports/client/layouts/test_layout/test_layout.js';

import '/imports/client/pages/not_found/not_found.js';

// A takes-all route for tests purpose
/*
FlowRouter.route('/*', {
    name: 'test',
    action(){
        BlazeLayout.render( 'testLayout', {});
    },
});
*/

// do we need this one ?
/*
FlowRouter.route('/setup/criterias', {
    name: 'App.setup.cri',
    action() {
        Session.set('setup.tab.name','time');
        Session.set('setup.action_status.obj',null);
        Session.set('setup.energy_values.obj',null);
        Session.set('setup.priority_values.obj',null);
        Session.set('setup.time_values.obj',null);
        BlazeLayout.render('App_topbar', { main: 'App_setup' });
    },
});
*/

let blazeRender = ( name ) => {
    const item = gtd.itemRoute( name );
    BlazeLayout.render( 'appLayout', {
        gtdid: item ? item.id : null,
        multiple: Boolean( item ? item.multiple : false ),
        group: gtd.groupItem( item ),
        template:gtd.templateItem( item )
    });
};

// Define a group which requires the user to be logged-in
const loggedInRoutes = FlowRouter.group({
    name: "logged-in",
    triggersEnter: [ function( context, redirect ){
        console.log( 'loggedInRoutes triggersEnter()' );
        //const route = context.route.name;
        //console.log( context );
        //console.log( 'route='+route );
    }]
});

// Set up all routes in the app
FlowRouter.route( '/', {
    name: 'rt.home',
    triggersEnter: [ function( context, redirect ){
        switch( Ronin.ui.runLayout()){
            case R_LYT_PAGE:
                redirect( '/thoughts' );
                break;
            case R_LYT_WINDOW:
                $().IWindowed.minimizeAll();
                break;
        }
    }],
    action(){
        BlazeLayout.render( 'appLayout', {});
    },
});
FlowRouter.route( '/setup', {
    name: 'rt.setup.lists',
    triggersEnter: [ function( context, redirect ){
        if( !Session.get( 'setup.tab.name' )){
            Session.set( 'setup.tab.name', 'gtd-setup-contexts' );
        }
        const route = gtd.routeId( 'setup', Session.get( 'setup.tab.name' ));
        redirect( FlowRouter.path( route ));
    }]
});
FlowRouter.route( '/setup/contexts', {
    name: 'rt.setup.contexts',
    action(){
        Session.set( 'page.group', 'gtd-setup-page' );
        Session.set( 'setup.tab.name', 'gtd-setup-contexts' );
        blazeRender( this.name );
    },
});
FlowRouter.route( '/setup/contexts/new', {
    name: 'rt.setup.context.new',
    action(){
        blazeRender( this.name );
    },
});
FlowRouter.route( '/setup/contexts/edit', {
    name: 'rt.setup.context.edit',
    action(){
        blazeRender( this.name );
    },
});
FlowRouter.route( '/setup/time', {
    name: 'rt.setup.time',
    action(){
        Session.set( 'page.group', 'gtd-setup-page' );
        Session.set( 'setup.tab.name', 'gtd-setup-time' );
        blazeRender( this.name );
    },
});
FlowRouter.route( '/setup/time/new', {
    name: 'rt.setup.time.new',
    action(){
        blazeRender( this.name );
    },
});
FlowRouter.route( '/setup/time/edit', {
    name: 'rt.setup.time.edit',
    action(){
        blazeRender( this.name );
    },
});
FlowRouter.route( '/setup/energy', {
    name: 'rt.setup.energy',
    action(){
        Session.set( 'page.group', 'gtd-setup-page' );
        Session.set( 'setup.tab.name', 'gtd-setup-energy' );
        blazeRender( this.name );
    },
});
FlowRouter.route( '/setup/energy/new', {
    name: 'rt.setup.energy.new',
    action(){
        blazeRender( this.name );
    },
});
FlowRouter.route( '/setup/energy/edit', {
    name: 'rt.setup.energy.edit',
    action(){
        blazeRender( this.name );
    },
});
FlowRouter.route( '/setup/priority', {
    name: 'rt.setup.priority',
    action(){
        Session.set( 'page.group', 'gtd-setup-page' );
        Session.set( 'setup.tab.name', 'gtd-setup-priority' );
        blazeRender( this.name );
    },
});
FlowRouter.route( '/setup/priority/new', {
    name: 'rt.setup.priority.new',
    action(){
        blazeRender( this.name );
    },
});
FlowRouter.route( '/setup/priority/edit', {
    name: 'rt.setup.priority.edit',
    action(){
        blazeRender( this.name );
    },
});
FlowRouter.route( '/setup/topics', {
    name: 'rt.setup.topics',
    action(){
        Session.set( 'page.group', 'gtd-setup-page' );
        Session.set( 'setup.tab.name', 'gtd-setup-topics' );
        blazeRender( this.name );
    },
});
FlowRouter.route( '/setup/topics/new', {
    name: 'rt.setup.topic.new',
    action(){
        blazeRender( this.name );
    },
});
FlowRouter.route( '/setup/topics/edit', {
    name: 'rt.setup.topic.edit',
    action(){
        blazeRender( this.name );
    },
});
FlowRouter.route( '/setup/refs', {
    name: 'rt.setup.ref',
    action(){
        Session.set( 'page.group', 'gtd-setup-page' );
        Session.set( 'setup.tab.name', 'gtd-setup-refs' );
        blazeRender( this.name );
    },
});
FlowRouter.route( '/setup/delegates', {
    name: 'rt.setup.delegates',
    action(){
        Session.set( 'page.group', 'gtd-setup-page' );
        Session.set( 'setup.tab.name', 'gtd-setup-delegates' );
        blazeRender( this.name );
    },
});
FlowRouter.route( '/gear/apk', {
    name: 'rt.gear.apk',
    action(){
        Session.set( 'page.group', 'gtd-setup-page' );
        blazeRender( this.name );
    },
});
FlowRouter.route( '/gear/device', {
    name: 'rt.gear.device',
    action(){
        Session.set( 'page.group', 'gtd-setup-page' );
        blazeRender( this.name );
    },
});
loggedInRoutes.route( '/gear/prefs', {
    name: 'rt.gear.prefs',
    action(){
        Session.set( 'page.group', 'gtd-setup-page' );
        blazeRender( this.name );
    },
});
loggedInRoutes.route( '/gear/prefs/lists', {
    name: 'rt.gear.prefs.window.list',
    action(){
        Session.set( 'page.group', 'gtd-setup-page' );
        blazeRender( this.name );
    },
});
FlowRouter.route( '/thoughts', {
    name: 'rt.thoughts.list',
    action(){
        Session.set( 'page.group', 'gtd-collect-thoughts-list' );
        blazeRender( this.name );
    },
});
loggedInRoutes.route( '/thoughts/edit', {
    name: 'rt.thoughts.edit',
    action(){
        blazeRender( this.name );
    },
});
loggedInRoutes.route( '/thoughts/new', {
    name: 'rt.thoughts.new',
    action(){
        blazeRender( this.name );
    },
});
loggedInRoutes.route( '/projects/new', {
    name: 'rt.projects.new',
    action(){
        blazeRender( this.name );
    },
});
loggedInRoutes.route( '/actions/new', {
    name: 'rt.actions.new',
    action(){
        blazeRender( this.name );
    },
});
loggedInRoutes.route( '/projects/thought', {
    name: 'rt.projects.thought',
    action(){
        blazeRender( this.name );
    },
});
loggedInRoutes.route( '/actions/thought', {
    name: 'rt.actions.thought',
    action(){
        blazeRender( this.name );
    },
});
FlowRouter.route( '/projects', {
    name: 'rt.projects',
    triggersEnter: [ function( context, redirect ){
        let tab = Session.get( 'projects.tab.name' );
        if( !tab || !tab.startsWith( 'gtd-' )){
            tab = 'gtd-review-projects-current';
        }
        redirect( FlowRouter.path( gtd.routeId( null, tab )));
    }],
});
FlowRouter.route( '/projects/current', {
    name: 'rt.projects.current',
    action(){
        Session.set( 'page.group', 'gtd-review-projects' );
        Session.set( 'projects.tab.name', 'gtd-review-projects-current' );
        blazeRender( this.name );
    },
});
FlowRouter.route( '/projects/single', {
    name: 'rt.projects.single',
    action(){
        Session.set( 'page.group', 'gtd-review-projects' );
        Session.set( 'projects.tab.name', 'gtd-review-projects-single' );
        blazeRender( this.name );
    },
});
FlowRouter.route( '/projects/future', {
    name: 'rt.projects.future',
    action(){
        Session.set( 'page.group', 'gtd-review-projects' );
        Session.set( 'projects.tab.name', 'gtd-review-projects-future' );
        blazeRender( this.name );
    },
});
loggedInRoutes.route( '/projects/edit', {
    name: 'rt.projects.edit',
    action(){
        blazeRender( this.name );
    },
});
FlowRouter.route( '/actions', {
    name: 'rt.actions',
    triggersEnter: [ function( context, redirect ){
        let tab = Session.get( 'actions.tab.name' );
        if( !tab || !tab.startsWith( 'gtd-' )){
            tab = 'gtd-review-actions-inactive';
        }
        redirect( FlowRouter.path( gtd.routeId( null, tab )));
    }],
});
FlowRouter.route( '/actions/inactive', {
    name: 'rt.actions.inactive',
    action(){
        Session.set( 'page.group', 'gtd-review-actions' );
        Session.set( 'actions.tab.name', 'gtd-review-actions-inactive' );
        blazeRender( this.name );
    },
});
FlowRouter.route( '/actions/asap', {
    name: 'rt.actions.asap',
    action(){
        Session.set( 'page.group', 'gtd-review-actions' );
        Session.set( 'actions.tab.name', 'gtd-review-actions-asap' );
        blazeRender( this.name );
    },
});
FlowRouter.route( '/actions/delegated', {
    name: 'rt.actions.delegated',
    action(){
        Session.set( 'page.group', 'gtd-review-actions' );
        Session.set( 'actions.tab.name', 'gtd-review-actions-delegated' );
        blazeRender( this.name );
    },
});
FlowRouter.route( '/actions/scheduled', {
    name: 'rt.actions.scheduled',
    action(){
        Session.set( 'page.group', 'gtd-review-actions' );
        Session.set( 'actions.tab.name', 'gtd-review-actions-scheduled' );
        blazeRender( this.name );
    },
});
FlowRouter.route( '/actions/waiting', {
    name: 'rt.actions.waiting',
    action(){
        Session.set( 'page.group', 'gtd-review-actions' );
        Session.set( 'actions.tab.name', 'gtd-review-actions-waiting' );
        blazeRender( this.name );
    },
});
FlowRouter.route( '/actions/done', {
    name: 'rt.actions.done',
    action(){
        Session.set( 'page.group', 'gtd-review-actions' );
        Session.set( 'actions.tab.name', 'gtd-review-actions-done' );
        blazeRender( this.name );
    },
});
loggedInRoutes.route( '/actions/edit', {
    name: 'rt.actions.edit',
    action(){
        blazeRender( this.name );
    },
});
FlowRouter.notFound = {
    name: 'not.found',
    action(){
        BlazeLayout.render( 'appLayout', { main: 'notFound' });
    },
};

// in page-based layout, reactive the last known group at startup time
if( Ronin.ui.runLayout() === R_LYT_PAGE ){
    const id = Session.get( 'page.group' );
    const route = gtd.routeId( 'footer', id );
    if( route ){
        FlowRouter.go( route );
    }
}
