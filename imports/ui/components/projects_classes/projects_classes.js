/*
 * 'projects_classes' component.
 *  The left sub-component of the 'projectsPage' page.
 *  Display one tab per project type.
 *  Session variables:
 *  - 'review.projects.tab': holds the name of the current tab
 */
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Counters } from '/imports/api/collections/counters/counters.js';
import { gtd } from '/imports/ui/interfaces/gtd/gtd.js';
import '/imports/ui/components/projects_tree/projects_tree.js';
import './projects_classes.html';

Template.projects_classes.fn = {
    tab: null,
    classes: [
        'projects',
        'actions',
        'future'
    ],
    // return the tabindex, counted from zero
    tabIndex: function( name ){
        const items = Template.projects_classes.fn.classes;
        for( var i=0 ; i<items.length ; ++i ){
            if( name === items[i] ){
                return i;
            }
        }
        return -1;
    },
    // activate the named tab
    tabActivate: function( name ){
        if( !Template.projects_classes.fn.tab ){
            //console.log( 'tabActivate cancelled as fn.tab not set' );
        } else {
            const index = Template.projects_classes.fn.tabIndex( name );
            Template.projects_classes.fn.tab.tabs( 'option', 'active', index );
        }
    },
    // update the route when tab is changed
    tabOnActivated: function( event, ui ){
        const previousTab = Session.get( 'review.projects.tab' );
        const newTab = ui.newPanel[0].id;
        if( newTab !== previousTab ){
            Session.set( 'review.projects.tab', newTab );
            let item = gtd.byId( newTab );
            if( item && item.router ){
                FlowRouter.go( item.router );
            }
        }
    },
    tabInit: function( instance ){
        if( !instance.handle.ready()){
            //console.log( 'tabInit cancelled as subscription not ready' );
        } else if( !instance.view.isRendered ){
            //console.log( 'tabInit cancelled as view not rendered' );
        } else {
            //console.log( 'projects_classes:tabInit ready' );
            // initialize the tab widget
            Template.projects_classes.fn.tab = instance.$('#tabs');
            Template.projects_classes.fn.tab.tabs({
                heightStyle: 'content',
                activate: Template.projects_classes.fn.tabOnActivated
            });
            // activate the initial tab
            let tabid = Session.get( 'review.projects.tab');
            if( !tabid ){
                tabid = Template.projects_classes.fn.classes[0];
                Session.set( 'review.projects.tab', tabid );
            }
            //console.log( 'tabInit calling tabActivate' );
            Template.projects_classes.fn.tabActivate( tabid )
        }
    }
};

Template.projects_classes.onCreated( function(){
    Template.projects_classes.fn.tab = null;
    this.autorun(() => {
        this.handle = this.subscribe('counters.all');
        if( this.handle.ready()){
            //console.log( 'onCreated subscription ready calling tabInit' );
            Template.projects_classes.fn.tabInit( this );
        }
    });
});

Template.projects_classes.onRendered( function(){
    //console.log( 'onRendered calling tabInit' );
    Template.projects_classes.fn.tabInit( this );
});

Template.projects_classes.helpers({
    classes(){
        return Counters.find({ name: 'root' }, { sort:{ nid: 1 }});
    }
});

Template.projects_classes.events({
});
