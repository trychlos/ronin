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

console.log( g );

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

let blazeRenderId = ( id ) => {
    const item = gtd.itemId( id );
    blazeRenderItem( item );
}

let blazeRenderItem = ( item ) => {
    BlazeLayout.render( 'appLayout', {
        gtdid: item ? item.id : null,
        multiple: item ? item.multiple : false,
        group: gtd.groupItem( item ),
        template:gtd.templateItem( item )
    });
}

let blazeRenderRoute = ( name ) => {
    const item = gtd.itemRoute( name );
    blazeRenderItem( item );
}

// Set up all routes in the app
FlowRouter.route('/', {
    name: 'rt.home',
    triggersEnter: [ function( context, redirect ){
        switch( g.run.layout.get()){
            case LYT_PAGE:
                redirect( '/thoughts' );
                break;
            case LYT_WINDOW:
                $().IWindowed.minimizeAll();
                break;
        }
    }],
    action(){
        BlazeLayout.render( 'appLayout', {});
    },
});
FlowRouter.route('/setup/contexts', {
    name: 'setup.contexts',
    action(){
        Session.set('setup.tab.name','contexts');
        Session.set('setup.contexts.obj',null);
        BlazeLayout.render( 'appLayout', { gtd:'setup', page:'setupPage', window:'setupWindow' });
    },
});
FlowRouter.route('/setup/time', {
    name: 'setup.time',
    action(){
        Session.set('setup.tab.name','time');
        Session.set('setup.time_values.obj',null);
        BlazeLayout.render( 'appLayout', { gtd:'setup', page:'setupPage', window:'setupWindow' });
    },
});
FlowRouter.route('/setup/energy', {
    name: 'setup.energy',
    action(){
        Session.set('setup.tab.name','energy');
        Session.set('setup.energy_values.obj',null);
        BlazeLayout.render( 'appLayout', { gtd:'setup', page:'setupPage', window:'setupWindow' });
    },
});
FlowRouter.route('/setup/priority', {
    name: 'setup.priority',
    action(){
        Session.set('setup.tab.name','priority');
        Session.set('setup.priority_values.obj',null);
        BlazeLayout.render( 'appLayout', { gtd:'setup', page:'setupPage', window:'setupWindow' });
    },
});
FlowRouter.route('/setup/topics', {
    name: 'setup.topics',
    action(){
        Session.set('setup.tab.name','topics');
        Session.set('setup.topics.obj',null);
        BlazeLayout.render( 'appLayout', { gtd:'setup', page:'setupPage', window:'setupWindow' });
    },
});
FlowRouter.route('/setup/refs', {
    name: 'setup.ref',
    action(){
        Session.set('setup.tab.name','refs');
        BlazeLayout.render( 'appLayout', { gtd:'setup', page:'setupPage', window:'setupWindow' });
    },
});
FlowRouter.route('/setup/delegates', {
    name: 'setup.delegates',
    action(){
        Session.set('setup.tab.name','delegates');
        BlazeLayout.render( 'appLayout', { gtd:'setup', page:'setupPage', window:'setupWindow' });
    },
});
FlowRouter.route( '/thoughts', {
    name: 'rt.thoughts.list',
    action(){
        Session.set( 'page.group', 'gtd-collect-thoughts-list' );
        Session.set( 'header.title', null );
        blazeRenderRoute( this.name );
    },
});
FlowRouter.route( '/thoughts/edit', {
    name: 'rt.thoughts.edit',
    action(){
        blazeRenderRoute( this.name );
    },
});
FlowRouter.route( '/thoughts/new', {
    name: 'rt.thoughts.new',
    action(){
        Session.set( 'collect.thought', null );
        blazeRenderRoute( this.name );
    },
});
FlowRouter.route('/projects/new', {
    name: 'rt.projects.new',
    action(){
        blazeRenderRoute( this.name );
    },
});
FlowRouter.route('/actions/new', {
    name: 'rt.actions.new',
    action(){
        blazeRenderRoute( this.name );
    },
});
FlowRouter.route('/projects/thought', {
    name: 'rt.projects.thought',
    action(){
        blazeRenderRoute( this.name );
    },
});
FlowRouter.route('/actions/thought', {
    name: 'rt.actions.thought',
    action(){
        blazeRenderRoute( this.name );
    },
});
FlowRouter.route('/projects', {
    name: 'rt.projects',
    action(){
        Session.set( 'page.group', 'gtd-review-projects' );
        const tab = Session.get( 'projects.tab.name' );
        if( !tab || !tab.startsWith( 'gtd-' )){
            Session.set( 'projects.tab.name', 'gtd-review-projects-current' );
        }
        blazeRenderId( Session.get( 'projects.tab.name' ));
    }
});
FlowRouter.route('/projects/current', {
    name: 'rt.projects.current',
    action(){
        Session.set( 'page.group', 'gtd-review-projects' );
        Session.set( 'projects.tab.name', 'gtd-review-projects-current' );
        Session.set( 'header.title', null );
        blazeRenderRoute( this.name );
    },
});
FlowRouter.route('/projects/single', {
    name: 'rt.projects.single',
    action(){
        Session.set( 'page.group', 'gtd-review-projects' );
        Session.set( 'projects.tab.name', 'gtd-review-projects-single' );
        Session.set( 'header.title', null );
        blazeRenderRoute( this.name );
    },
});
FlowRouter.route('/projects/future', {
    name: 'rt.projects.future',
    action(){
        Session.set( 'page.group', 'gtd-review-projects' );
        Session.set( 'projects.tab.name', 'gtd-review-projects-future' );
        Session.set( 'header.title', null );
        blazeRenderRoute( this.name );
    },
});
FlowRouter.route('/projects/edit', {
    name: 'rt.projects.edit',
    action(){
        blazeRenderRoute( this.name );
    },
});
FlowRouter.route('/actions', {
    name: 'rt.actions',
    action(){
        Session.set( 'page.group', 'gtd-review-actions' );
        const tab = Session.get( 'actions.tab.name' );
        if( !tab || !tab.startsWith( 'gtd-' )){
            Session.set( 'actions.tab.name', 'gtd-review-actions-inactive' );
        }
        blazeRenderId( Session.get( 'actions.tab.name' ));
    }
});
FlowRouter.route('/actions/inactive', {
    name: 'rt.actions.inactive',
    action(){
        Session.set( 'page.group', 'gtd-review-actions' );
        Session.set( 'actions.tab.name', 'gtd-review-actions-inactive' );
        Session.set( 'header.title', null );
        blazeRenderRoute( this.name );
    },
});
FlowRouter.route('/actions/asap', {
    name: 'rt.actions.asap',
    action(){
        Session.set( 'page.group', 'gtd-review-actions' );
        Session.set( 'actions.tab.name', 'gtd-review-actions-asap' );
        Session.set( 'header.title', null );
        blazeRenderRoute( this.name );
    },
});
FlowRouter.route('/actions/delegated', {
    name: 'rt.actions.delegated',
    action(){
        Session.set( 'page.group', 'gtd-review-actions' );
        Session.set( 'actions.tab.name', 'gtd-review-actions-delegated' );
        Session.set( 'header.title', null );
        blazeRenderRoute( this.name );
    },
});
FlowRouter.route('/actions/scheduled', {
    name: 'rt.actions.scheduled',
    action(){
        Session.set( 'page.group', 'gtd-review-actions' );
        Session.set( 'actions.tab.name', 'gtd-review-actions-scheduled' );
        Session.set( 'header.title', null );
        blazeRenderRoute( this.name );
    },
});
FlowRouter.route('/actions/waiting', {
    name: 'rt.actions.waiting',
    action(){
        Session.set( 'page.group', 'gtd-review-actions' );
        Session.set( 'actions.tab.name', 'gtd-review-actions-waiting' );
        Session.set( 'header.title', null );
        blazeRenderRoute( this.name );
    },
});
FlowRouter.route('/actions/done', {
    name: 'rt.actions.done',
    action(){
        Session.set( 'page.group', 'gtd-review-actions' );
        Session.set( 'actions.tab.name', 'gtd-review-actions-done' );
        Session.set( 'header.title', null );
        blazeRenderRoute( this.name );
    },
});
FlowRouter.route('/actions/edit', {
    name: 'rt.actions.edit',
    action(){
        Session.set( 'projects.tab.name', 'actions' );
        blazeRenderRoute( this.name );
    },
});
FlowRouter.notFound = {
    name: 'not.found',
    action(){
        blazeRenderRoute( this.name );
    },
};

// in page-based layout, reactive the last known group at startup time
const layout = g.run.layout.get();
if( layout === LYT_PAGE ){
    const id = Session.get( 'page.group' );
    const route = gtd.routeId( 'footer', id );
    if( route ){
        FlowRouter.go( route );
    }
}
