/*
 * 'projectsList' window.
 *
 *  Display (at least) the list of actions.
 *  Each action as buttons:
 *  - to update/delete the action
 *
 *  pageLayout:
 *  - each panel has its own window which comes on the top of the previous one.
 *
 *  windowLayout:
 *  - each panel may be opened in its own window.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> <app layout layer> { gtdid, group, template }
 *              +-> <group layer> { gtdid, group, template }
 *                      |
 *                      +-> thoughtsList { gtdid, group, template }
 *                              +-> thoughts_list
 *                              +-> plus_button in page-based layout
 *                      |
 *                      +-> thoughtEdit { gtdid, group, template }
 *
 *  Parameters:
 *  - 'data': the layout context built in appLayout, and passed in by group layer.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import '/imports/client/components/plus_button/plus_button.js';
import '/imports/client/components/projects_tabs/projects_tabs.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './projects_list.html';

Template.projectsList.fn = {
    actionNew: function(){
        g.run.back = FlowRouter.current().route.name;
        FlowRouter.go( 'project.new' );
    }
};

Template.projectsList.onCreated( function(){
    //console.log( 'projectsList.onCreated' );
    this.subscribe( 'articles.projects.all' );
    this.subscribe( 'topics.all' );
    this.subscribe( 'contexts.all' );
});

Template.projectsList.onRendered( function(){
    //console.log( 'projectsList.onRendered' );
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            const context = Template.currentData();
            $( '.'+context.template ).IWindowed({
                template: context.template,
                simone: {
                    buttons: [
                        {
                            text: "Close",
                            click: function(){
                                $.pubsub.publish( 'ronin.ui.projects.list.card.collapse-all' );
                                $().IWindowed.close( '.'+context.template );
                            }
                        },
                        {
                            text: "New",
                            click: function(){
                                Template.projectsList.fn.actionNew();
                            }
                        }
                    ],
                    group:  context.group,
                    title:  gtd.labelId( 'window', context.gtdid )
                }
            });
        }
    });
});

Template.projectsList.helpers({
    projects(){
        return Articles.find({ type:'P' }, { sort:{ createdAt: -1 }});
    }
});

Template.projectsList.events({
    // page layout
    'click .js-new'( ev, instance ){
        Template.projectsList.fn.actionNew();
        return false;
    }
});

Template.projectsList.onDestroyed( function(){
    console.log( 'projectsList.onDestroyed' );
});
