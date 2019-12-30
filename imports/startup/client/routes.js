import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/layouts/body/body.js';
import '/imports/ui/layouts/desktop/desktop.js';
//import '/imports/ui/layouts/unused_topbar/topbar.js';

import '/imports/ui/pages/actions/actions.js';
import '/imports/ui/pages/collect/collect.js';
import '/imports/ui/pages/overview/overview.js';
import '/imports/ui/pages/process/process.js';
//import '/imports/ui/pages/projects/projects.js';
import '/imports/ui/pages/setup/setup.js';
import '/imports/ui/pages/not_found/not_found.js';

// Set up all routes in the app
FlowRouter.route('/', {
    name: 'home',
    action(){
        BlazeLayout.render('appDesktop', { main: 'overviewPage' });
    },
});
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
FlowRouter.route('/setup/contexts', {
    name: 'setup.contexts',
    action(){
        Session.set('setup.tab.name','contexts');
        Session.set('setup.contexts.obj',null);
        BlazeLayout.render('appDesktop', { main: 'setupPage' });
    },
});
FlowRouter.route('/setup/time', {
    name: 'setup.time.values',
    action(){
        Session.set('setup.tab.name','time');
        Session.set('setup.time_values.obj',null);
        BlazeLayout.render('appDesktop', { main: 'setupPage' });
    },
});
FlowRouter.route('/setup/energy', {
    name: 'setup.energy.values',
    action(){
        Session.set('setup.tab.name','energy');
        Session.set('setup.energy_values.obj',null);
        BlazeLayout.render('appDesktop', { main: 'setupPage' });
    },
});
FlowRouter.route('/setup/priority', {
    name: 'setup.priority.values',
    action(){
        Session.set('setup.tab.name','priority');
        Session.set('setup.priority_values.obj',null);
        BlazeLayout.render('appDesktop', { main: 'setupPage' });
    },
});
FlowRouter.route('/setup/status', {
    name: 'setup.action.status',
    action(){
        Session.set('setup.tab.name','status');
        Session.set('setup.action_status.obj',null);
        BlazeLayout.render('appDesktop', { main: 'setupPage' });
    },
});
FlowRouter.route('/setup/topics', {
    name: 'setup.topics',
    action(){
        Session.set('setup.tab.name','topics');
        Session.set('setup.topics.obj',null);
        BlazeLayout.render('appDesktop', { main: 'setupPage' });
    },
});
FlowRouter.route('/setup/refs', {
    name: 'setup.ref.items',
    action(){
        Session.set('setup.tab.name','refs');
        BlazeLayout.render('appDesktop', { main: 'setupPage' });
    },
});
FlowRouter.route('/setup/delegates', {
    name: 'setup.delegates',
    action(){
        Session.set('setup.tab.name','delegates');
        BlazeLayout.render('appDesktop', { main: 'setupPage' });
    },
});
FlowRouter.route('/collect', {
    name: 'collect.thoughts',
    action(){
        Session.set('setup.thoughts.obj',null);
        BlazeLayout.render('appDesktop', { main: 'collectPage' });
    },
});
FlowRouter.route('/process', {
    name: 'process.thoughts',
    action(){
        BlazeLayout.render('appDesktop', { main: 'processPage' });
    },
});
FlowRouter.route('/review/projects', {
    name: 'review.projects',
    action(){
        Session.set('review.projects.tab', 'projects' );
        BlazeLayout.render('appDesktop', { main: 'projectsPage' });
    },
});
FlowRouter.route('/review/future', {
    name: 'review.future',
    action(){
        Session.set('review.projects.tab', 'future' );
        BlazeLayout.render('appDesktop', { main: 'projectsPage' });
    },
});
FlowRouter.route('/review/actions', {
    name: 'review.actions',
    action(){
        Session.set('review.projects.tab', 'actions' );
        BlazeLayout.render('appDesktop', { main: 'projectsPage' });
    },
});
FlowRouter.route('/review/inactive', {
    name: 'review.actions.inactive',
    action(){
        Session.set('review.actions.tab', 'ina' );
        BlazeLayout.render('appDesktop', { main: 'actionsPage' });
    },
});
FlowRouter.route('/review/asap', {
    name: 'review.actions.asap',
    action(){
        Session.set('review.actions.tab', 'asa' );
        BlazeLayout.render('appDesktop', { main: 'actionsPage' });
    },
});
FlowRouter.route('/review/scheduled', {
    name: 'review.actions.scheduled',
    action(){
        Session.set('review.actions.tab', 'sch' );
        BlazeLayout.render('appDesktop', { main: 'actionsPage' });
    },
});
FlowRouter.route('/review/delegated', {
    name: 'review.actions.delegated',
    action(){
        Session.set('review.actions.tab', 'del' );
        BlazeLayout.render('appDesktop', { main: 'actionsPage' });
    },
});
FlowRouter.route('/review/done', {
    name: 'review.actions.done',
    action(){
        Session.set('review.actions.tab', 'don' );
        BlazeLayout.render('appDesktop', { main: 'actionsPage' });
    },
});
FlowRouter.notFound = {
    name: 'not.found',
    action(){
        BlazeLayout.render('appBody', { main: 'notFound' });
    },
};
