/*
 * 'setup' component.
 *  This is the main component of the setup page.
 *  Display a tab per reference table.
 *  Parameters:
 *  - tabid: tab identifier from routes.js.
 *  Session variables:
 *  - 'setup.tab.name': holds the name of the current tab
 *  Reactive state:
 *  - rendered: true when the template has been rendered
 */
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';
import { gtd } from '/imports/ui/interfaces/gtd/gtd.js';
import '/imports/ui/components/setup_contexts/setup_contexts.js';
import '/imports/ui/components/setup_energy/setup_energy.js';
import '/imports/ui/components/setup_priority/setup_priority.js';
import '/imports/ui/components/setup_status/setup_status.js';
import '/imports/ui/components/setup_time/setup_time.js';
import '/imports/ui/components/setup_topics/setup_topics.js';
import './setup.html';

Template.setup.fn = {
    tab: null,
    // return the tabindex, counted from zero
    tabIndex: function( name ){
        const items = gtd.setupItems();
        for( var i=0 ; i<items.length ; ++i ){
            if( name === items[i].id ){
                return i;
            }
        }
        return -1;
    },
    // activate the named tab
    tabActivate: function( name ){
        if( Template.setup.fn.tab ){
            const index = Template.setup.fn.tabIndex( name );
            Template.setup.fn.tab.tabs( 'option', 'active', index );
        }
    },
    tabOnActivated: function( event, ui ){
        const previousTab = Session.get( 'setup.tab.name' );
        const newTab = ui.newPanel[0].id;
        if( newTab !== previousTab ){
            Session.set( 'setup.tab.name', newTab );
            let item = gtd.byId( newTab );
            if( item && item.router ){
                FlowRouter.go( item.router );
            }
        }
    }
};

Template.setup.onCreated( function(){
});

Template.setup.onRendered( function(){
    // initialize the tab widget
    Template.setup.fn.tab = this.$('#tabs');
    Template.setup.fn.tab.tabs({
        heightStyle: 'content',
        activate: Template.setup.fn.tabOnActivated
    });
    // activate the intial tab
    // the two lines are needed as the first autorun is run before the
    //  page is first rendered
    Session.set( 'setup.tab.name', this.data.tabid );
    Template.setup.fn.tabActivate( this.data.tabid )
});

Template.setup.helpers({
    gtdSetup(){
        return gtd.setupItems();
    }
});

Template.setup.events({
});
