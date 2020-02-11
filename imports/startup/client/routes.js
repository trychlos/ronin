/*
 * /imports/startup/client/routes.js
 */
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/layouts/app_layout/app_layout.js';
import '/imports/client/layouts/test_layout/test_layout.js';

import '/imports/client/pages/actions_page/actions_page.js';
import '/imports/client/pages/devel_page/devel_page.js';
import '/imports/client/pages/edit_page/edit_page.js';
import '/imports/client/pages/empty/empty.js';
import '/imports/client/pages/projects_page/projects_page.js';
import '/imports/client/pages/setup_page/setup_page.js';
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

// Set up all routes in the app
FlowRouter.route('/', {
    name: 'home',
    triggersEnter: [ function( context, redirect ){
        if( g.run.layout.get() === LYT_PAGE ){
            redirect( '/thoughts' );
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
    name: 'collect',
    action(){
        //console.log( 'routing collect' );
        Session.set( 'gtd.group', 'collect' );
        Session.set( 'header.title', null );
        BlazeLayout.render( 'appLayout', { gtd:'collect', page:'collectPage', window:'thoughtsList' });
    },
});
FlowRouter.route( '/thoughts/new', {
    name: 'collect.new',
    action(){
        //console.log( 'routing collect.new' );
        Session.set( 'gtd.group', 'collect' );
        Session.set( 'collect.thought', null );
        BlazeLayout.render( 'appLayout', { gtd:'collect', page:'collectPage', window:'thoughtEdit' });
    },
});
FlowRouter.route( '/thoughts/edit', {
    name: 'collect.edit',
    action(){
        Session.set( 'gtd.group', 'collect' );
        BlazeLayout.render( 'appLayout', { gtd:'collect', page:'collectPage', window:'thoughtEdit' });
    },
});
FlowRouter.route('/process', {
    name: 'process.thoughts',
    action(){
        Session.set( 'gtd.group', 'process' );
        BlazeLayout.render( 'appLayout', { main: 'processPage' });
    },
});
FlowRouter.route('/thoughts/action', {
    name: 'process.action',
    action(){
        Session.set( 'gtd.group', 'collect' );
        BlazeLayout.render( 'appLayout', { gtd:'process', page:'processPage', window:'actionProcess' });
    },
});
FlowRouter.route('/thoughts/project', {
    name: 'process.project',
    action(){
        Session.set( 'gtd.group', 'collect' );
        BlazeLayout.render( 'appLayout', { gtd:'process', page:'processPage', window:'projectProcess' });
    },
});
FlowRouter.route('/projects', {
    name: 'review.projects',
    action(){
        Session.set( 'gtd.group', 'projects' );
        Session.set( 'projects.tab.name', 'projects' );
        Session.set( 'header.title', null );
        BlazeLayout.render( 'appLayout', { gtd:'review', page:'reviewPage', window:'projectsList' });
    },
});
FlowRouter.route('/projects/future', {
    name: 'review.future',
    action(){
        Session.set( 'gtd.group', 'projects' );
        Session.set( 'projects.tab.name', 'future' );
        Session.set( 'header.title', null );
        BlazeLayout.render( 'appLayout', { gtd:'review', page:'reviewPage', window:'projectsList' });
    },
});
FlowRouter.route('/projects/new', {
    name: 'project.new',
    action(){
        Session.set( 'gtd.group', 'projects' );
        Session.set( 'projects.tab.name', 'projects' );
        BlazeLayout.render( 'appLayout', { gtd:'review', page:'reviewPage', window:'projectEdit' });
    },
});
FlowRouter.route('/projects/edit', {
    name: 'project.edit',
    action(){
        Session.set( 'gtd.group', 'projects' );
        Session.set( 'projects.tab.name', 'projects' );
        BlazeLayout.render( 'appLayout', { gtd:'review', page:'reviewPage', window:'projectEdit' });
    },
});
FlowRouter.route('/actions', {
    name: 'review.actions',
    action(){
        Session.set( 'gtd.group', 'actions' );
        Session.set( 'projects.tab.name', 'actions' );
        Session.set( 'header.title', null );
        BlazeLayout.render( 'appLayout', { gtd:'review', page:'reviewPage', window:'actionsList' });
    },
});
FlowRouter.route('/actions/new', {
    name: 'action.new',
    action(){
        Session.set( 'gtd.group', 'actions' );
        Session.set( 'projects.tab.name', 'actions' );
        BlazeLayout.render( 'appLayout', { gtd:'review', page:'reviewPage', window:'actionEdit' });
    },
});
FlowRouter.route('/actions/edit', {
    name: 'action.edit',
    action(){
        Session.set( 'gtd.group', 'actions' );
        Session.set( 'projects.tab.name', 'actions' );
        BlazeLayout.render( 'appLayout', { gtd:'review', page:'reviewPage', window:'actionEdit' });
    },
});
FlowRouter.route('/review/inactive', {
    name: 'review.inactive',
    action(){
        Session.set('actions.tab.name', 'ina' );
        BlazeLayout.render( 'appLayout', { main: 'actionsPage' });
    },
});
FlowRouter.route('/review/asap', {
    name: 'review.asap',
    action(){
        Session.set('actions.tab.name', 'asa' );
        BlazeLayout.render( 'appLayout', { main: 'actionsPage' });
    },
});
FlowRouter.route('/review/scheduled', {
    name: 'review.scheduled',
    action(){
        Session.set('actions.tab.name', 'sch' );
        BlazeLayout.render( 'appLayout', { main: 'actionsPage' });
    },
});
FlowRouter.route('/review/delegated', {
    name: 'review.delegated',
    action(){
        Session.set('actions.tab.name', 'del' );
        BlazeLayout.render( 'appLayout', { main: 'actionsPage' });
    },
});
FlowRouter.route('/review/done', {
    name: 'review.done',
    action(){
        Session.set('actions.tab.name', 'don' );
        BlazeLayout.render( 'appLayout', { main: 'actionsPage' });
    },
});
FlowRouter.notFound = {
    name: 'not.found',
    action(){
        BlazeLayout.render( 'appLayout', { page: 'notFound' });
    },
};

// in page-based layout, reactive the last known group at startup time
const layout = g.run.layout.get();
if( layout === LYT_PAGE ){
    const id = Session.get( 'gtd.group' );
    const route = gtd.routeId( 'footer', id );
    if( route ){
        FlowRouter.go( route );
    }
}
