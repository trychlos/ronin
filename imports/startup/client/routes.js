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

let blazeRender = ( name ) => {
    const item = gtd.itemRoute( name );
    BlazeLayout.render( 'appLayout', {
        gtdid: item ? item.id : null,
        multiple: item ? item.multiple : false,
        group: gtd.groupItem( item ),
        template:gtd.templateItem( item )
    });
}

// Set up all routes in the app
FlowRouter.route('/', {
    name: 'home',
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
    name: 'collect.list',
    action(){
        Session.set( 'gtd.page', 'thoughts-list' );
        Session.set( 'header.title', null );
        blazeRender( this.name );
    },
});
FlowRouter.route( '/thoughts/new', {
    name: 'collect.new',
    action(){
        Session.set( 'collect.thought', null );
        blazeRender( this.name );
    },
});
FlowRouter.route( '/thoughts/edit', {
    name: 'collect.edit',
    action(){
        blazeRender( this.name );
    },
});
FlowRouter.route('/process', {
    name: 'process.thoughts',
    action(){
        blazeRender( this.name );
    },
});
FlowRouter.route('/thoughts/action', {
    name: 'process.action',
    action(){
        blazeRender( this.name );
    },
});
FlowRouter.route('/thoughts/project', {
    name: 'process.project',
    action(){
        blazeRender( this.name );
    },
});
FlowRouter.route('/projects', {
    name: 'review.projects',
    action(){
        Session.set( 'gtd.page', 'projects-list' );
        Session.set( 'projects.tab.name', 'projects-list' );
        Session.set( 'header.title', null );
        blazeRender( this.name );
    },
});
FlowRouter.route('/projects/future', {
    name: 'review.future',
    action(){
        Session.set( 'projects.tab.name', 'projects-future' );
        Session.set( 'header.title', null );
        blazeRender( this.name );
    },
});
FlowRouter.route('/projects/new', {
    name: 'project.new',
    action(){
        Session.set( 'projects.tab.name', 'projects' );
        blazeRender( this.name );
    },
});
FlowRouter.route('/projects/edit', {
    name: 'project.edit',
    action(){
        Session.set( 'projects.tab.name', 'projects' );
        blazeRender( this.name );
    },
});
FlowRouter.route('/actions', {
    name: 'review.actions',
    action(){
        Session.set( 'gtd.page', 'actions-list' );
        Session.set( 'projects.tab.name', 'actions-list' );
        Session.set( 'header.title', null );
        blazeRender( this.name );
    },
});
FlowRouter.route('/actions/new', {
    name: 'action.new',
    action(){
        Session.set( 'projects.tab.name', 'actions' );
        blazeRender( this.name );
    },
});
FlowRouter.route('/actions/edit', {
    name: 'action.edit',
    action(){
        Session.set( 'projects.tab.name', 'actions' );
        blazeRender( this.name );
    },
});
FlowRouter.route('/review/inactive', {
    name: 'review.inactive',
    action(){
        Session.set('actions.tab.name', 'actions-inactive' );
        blazeRender( this.name );
    },
});
FlowRouter.route('/review/asap', {
    name: 'review.asap',
    action(){
        Session.set('actions.tab.name', 'actions-asap' );
        blazeRender( this.name );
    },
});
FlowRouter.route('/review/scheduled', {
    name: 'review.scheduled',
    action(){
        Session.set('actions.tab.name', 'actions-scheduled' );
        blazeRender( this.name );
    },
});
FlowRouter.route('/review/delegated', {
    name: 'review.delegated',
    action(){
        Session.set('actions.tab.name', 'actions-delegated' );
        blazeRender( this.name );
    },
});
FlowRouter.route('/review/waiting', {
    name: 'review.waiting',
    action(){
        Session.set('actions.tab.name', 'actions-wait' );
        blazeRender( this.name );
    },
});
FlowRouter.route('/review/done', {
    name: 'review.done',
    action(){
        Session.set('actions.tab.name', 'actions-done' );
        blazeRender( this.name );
    },
});
FlowRouter.notFound = {
    name: 'not.found',
    action(){
        blazeRender( this.name );
    },
};

// in page-based layout, reactive the last known group at startup time
const layout = g.run.layout.get();
if( layout === LYT_PAGE ){
    const id = Session.get( 'gtd.page' );
    const route = gtd.routeId( 'footer', id );
    if( route ){
        FlowRouter.go( route );
    }
}
