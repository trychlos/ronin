
/*
 * 'actions_classes' component.
 *  The left sub-component of the 'actionsPage' page.
 *  Display one tab per action status.
 *  Session variables:
 *  - 'review.actions.tab': holds the name of the current tab
 */
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Actions } from '/imports/api/collections/actions/actions.js';
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import { Projects } from '/imports/api/collections/projects/projects.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import { gtd } from '/imports/ui/interfaces/gtd/gtd.js';
import '/imports/ui/components/actions_grid/actions_grid.js';
import './actions_classes.html';

Template.actions_classes.fn = {
    tab: null,
    classes: [
        'ina',
        'asa',
        'sch',
        'del',
        'don'
    ],
    // return the tabindex, counted from zero
    tabIndex: function( name ){
        const items = Template.actions_classes.fn.classes;
        for( var i=0 ; i<items.length ; ++i ){
            if( name === items[i] ){
                return i;
            }
        }
        return -1;
    },
    // activate the named tab
    tabActivate: function( name ){
        if( !Template.actions_classes.fn.tab ){
            console.log( 'tabActivate cancelled as fn.tab not set' );
        } else {
            const index = Template.actions_classes.fn.tabIndex( name );
            Template.actions_classes.fn.tab.tabs( 'option', 'active', index );
        }
    },
    // update the route when tab is changed
    tabOnActivated: function( event, ui ){
        const previousTab = Session.get( 'review.actions.tab' );
        const newTab = ui.newPanel[0].id;
        if( newTab !== previousTab ){
            Session.set( 'review.actions.tab', newTab );
            let item = gtd.byId( newTab );
            if( item && item.router ){
                FlowRouter.go( item.router );
            }
        }
    },
    tabInit: function( instance ){
        if( !Session.get( 'review.actions.areReady')){
            //console.log( 'tabInit cancelled as subscription not ready' );
        } else if( !instance.view.isRendered ){
            //console.log( 'tabInit cancelled as view not rendered' );
        } else {
            //console.log( 'actions_classes:tabInit ready' );
            // initialize the tab widget
            Template.actions_classes.fn.tab = instance.$('#tabs');
            Template.actions_classes.fn.tab.tabs({
                heightStyle: 'content',
                activate: Template.actions_classes.fn.tabOnActivated
            });
            // activate the initial tab
            let tabid = Session.get( 'review.actions.tab');
            if( !tabid ){
                tabid = Template.actions_classes.fn.classes[0];
                Session.set( 'review.actions.tab', tabid );
            }
            //console.log( 'tabInit calling tabActivate with tabid='+tabid );
            Template.actions_classes.fn.tabActivate( tabid )
        }
    }
};

Template.actions_classes.onCreated( function(){
    //console.log( 'onCreated' );
    Template.actions_classes.fn.tab = null;
    this.handles = [
        this.subscribe('actions.all'),
        this.subscribe('contexts.all'),
        this.subscribe('projects.all'),
        this.subscribe('topics.all')
    ];
    Session.set( 'review.actions.areReady', false );
    this.autorun(() => {
        Session.set( 'review.actions.areReady', this.handles.every( h => h.ready()));
        if( Session.get( 'review.actions.areReady')){
            //console.log( 'onCreated subscription ready calling tabInit' );
            Template.actions_classes.fn.tabInit( this );
        }
    });
});

Template.actions_classes.onRendered( function(){
    //console.log( 'onRendered calling tabInit' );
    Template.actions_classes.fn.tabInit( this );
});

Template.actions_classes.helpers({
    classes(){
        return Template.actions_classes.fn.classes;
    },
    itLabel( id ){
        const item = gtd.byId( id );
        return item ? item.label : '';
    }
});

Template.actions_classes.events({
});
