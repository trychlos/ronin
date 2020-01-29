/*
 * /imports/startup/client/routes.js
 */
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/client/layouts/body/body.js';
import '/imports/client/layouts/page_layout/page_layout.js';
import '/imports/client/layouts/desktop_layout/desktop_layout.js';

import '/imports/client/pages/actions_page/actions_page.js';
import '/imports/client/pages/devel_page/devel_page.js';
import '/imports/client/pages/edit_page/edit_page.js';
import '/imports/client/pages/empty/empty.js';
import '/imports/client/pages/process_page/process_page.js';
import '/imports/client/pages/projects_page/projects_page.js';
import '/imports/client/pages/setup_page/setup_page.js';
import '/imports/client/pages/not_found/not_found.js';

console.log( g );

// A takes-all route for tests purpose
/*
FlowRouter.route('/*', {
    name: 'all',
    action(){
        BlazeLayout.render( 'appBody', { main: 'develPage' });
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
    action(){
        BlazeLayout.render( g.run.layout.get(), { main: 'empty' });
    },
});
FlowRouter.route('/setup/contexts', {
    name: 'setup.contexts',
    action(){
        Session.set('setup.tab.name','contexts');
        Session.set('setup.contexts.obj',null);
        BlazeLayout.render( g.run.layout.get(), { main: 'setupPage' });
    },
});
FlowRouter.route('/setup/time', {
    name: 'setup.time.values',
    action(){
        Session.set('setup.tab.name','time');
        Session.set('setup.time_values.obj',null);
        BlazeLayout.render( g.run.layout.get(), { main: 'setupPage' });
    },
});
FlowRouter.route('/setup/energy', {
    name: 'setup.energy.values',
    action(){
        Session.set('setup.tab.name','energy');
        Session.set('setup.energy_values.obj',null);
        BlazeLayout.render( g.run.layout.get(), { main: 'setupPage' });
    },
});
FlowRouter.route('/setup/priority', {
    name: 'setup.priority.values',
    action(){
        Session.set('setup.tab.name','priority');
        Session.set('setup.priority_values.obj',null);
        BlazeLayout.render( g.run.layout.get(), { main: 'setupPage' });
    },
});
FlowRouter.route('/setup/topics', {
    name: 'setup.topics',
    action(){
        Session.set('setup.tab.name','topics');
        Session.set('setup.topics.obj',null);
        BlazeLayout.render( g.run.layout.get(), { main: 'setupPage' });
    },
});
FlowRouter.route('/setup/refs', {
    name: 'setup.ref.items',
    action(){
        Session.set('setup.tab.name','refs');
        BlazeLayout.render( g.run.layout.get(), { main: 'setupPage' });
    },
});
FlowRouter.route('/setup/delegates', {
    name: 'setup.delegates',
    action(){
        Session.set('setup.tab.name','delegates');
        BlazeLayout.render( g.run.layout.get(), { main: 'setupPage' });
    },
});
FlowRouter.route('/collect', {
    name: 'collect',
    action(){
        Session.set( 'route.last', 'collect' );
        BlazeLayout.render( g.run.layout.get(), { page:'collectPage', window:'collectList' });
    },
});
FlowRouter.route('/collect/new', {
    name: 'collect.new',
    action(){
        Session.set( 'route.last', 'collect' );
        Session.set( 'collect.thought', null );
        BlazeLayout.render( g.run.layout.get(), { page:'collectPage', window:'collectEdit' });
    },
});
FlowRouter.route('/collect/new', {
    name: 'collect.new',
    action(){
        Session.set( 'route.last', 'collect' );
        BlazeLayout.render( g.run.layout.get(), { page:'collectPage', window:'collectEdit' });
    },
});
FlowRouter.route('/process', {
    name: 'process.thoughts',
    action(){
        Session.set( 'route.last', 'process' );
        BlazeLayout.render( g.run.layout.get(), { main: 'processPage' });
    },
});
FlowRouter.route('/project/new', {
    name: 'process.new.project',
    action(){
        //console.log( "FlowRouter process.init.obj={ type:'P', name:'New project'}" );
        Session.set( 'process.edit.obj', { type:'P', name:'New project'});
        BlazeLayout.render( g.run.layout.get(), { main: 'editPage' });
    },
});
FlowRouter.route('/action/new', {
    name: 'process.new.action',
    action(){
        //console.log( "FlowRouter process.init.obj={ type:'A', name:'New action'}" );
        Session.set( 'process.edit.obj', { type:'A', name:'New action'});
        BlazeLayout.render( g.run.layout.get(), { main: 'editPage' });
    },
});
FlowRouter.route('/review/projects', {
    name: 'review.projects',
    action(){
        Session.set('projects.tab.name', 'projects' );
        BlazeLayout.render( g.run.layout.get(), { main: 'projectsPage' });
    },
});
FlowRouter.route('/review/future', {
    name: 'review.future',
    action(){
        Session.set('projects.tab.name', 'future' );
        BlazeLayout.render( g.run.layout.get(), { main: 'projectsPage' });
    },
});
FlowRouter.route('/review/actions', {
    name: 'review.actions',
    action(){
        Session.set('projects.tab.name', 'actions' );
        BlazeLayout.render( g.run.layout.get(), { main: 'projectsPage' });
    },
});
FlowRouter.route('/review/inactive', {
    name: 'review.inactive',
    action(){
        Session.set('actions.tab.name', 'ina' );
        BlazeLayout.render( g.run.layout.get(), { main: 'actionsPage' });
    },
});
FlowRouter.route('/review/asap', {
    name: 'review.asap',
    action(){
        Session.set('actions.tab.name', 'asa' );
        BlazeLayout.render( g.run.layout.get(), { main: 'actionsPage' });
    },
});
FlowRouter.route('/review/scheduled', {
    name: 'review.scheduled',
    action(){
        Session.set('actions.tab.name', 'sch' );
        BlazeLayout.render( g.run.layout.get(), { main: 'actionsPage' });
    },
});
FlowRouter.route('/review/delegated', {
    name: 'review.delegated',
    action(){
        Session.set('actions.tab.name', 'del' );
        BlazeLayout.render( g.run.layout.get(), { main: 'actionsPage' });
    },
});
FlowRouter.route('/review/done', {
    name: 'review.done',
    action(){
        Session.set('actions.tab.name', 'don' );
        BlazeLayout.render( g.run.layout.get(), { main: 'actionsPage' });
    },
});
FlowRouter.notFound = {
    name: 'not.found',
    action(){
        BlazeLayout.render('appBody', { main: 'notFound' });
    },
};

/*
const layout = g.run.layout.get();
switch( layout ){
    case LYT_WINDOW:
        break;
    case LYT_PAGE:
        FlowRouter.go( 'collect' );
        break;
    default:
        console.log( layout+': unknown layout' );
}
*/
