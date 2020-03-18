/*
 * 'actions_grid' component.
 *  Display actions in a grid depending of their status.
 *
 *  NB: this actionsGrid is only displayed in windowLayout mode.
 *
 *  NB: most of the found grid jQuery plugins work by managing all their datas
 *  inside of JS code, i.e. without any HTML tag. This prevent us to use any
 *  template. In particular, we cannot use ownership_button, project_button,
 *  and so on.
 *  This is the case for jqxGrid, Bootgrid, pqGrid...
 *  Others plugins are obsolete (do not comply with our new jQuery/Bootstrap
 *  versions).
 *  => so get stuck with a standard table here.
 *
 *  Parameters:
 *  - tab: the tab (aka the status) being displayed.
 *  - actions: the corresponding actions as a cursor.
 *
 *  Session variables:
 *  - actions.tab.name: the current tab.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/client/components/delete_button/delete_button.js';
import '/imports/client/components/edit_button/edit_button.js';
import '/imports/client/components/ownership_button/ownership_button.js';
import '/imports/client/components/project_button/project_button.js';
import '/imports/client/interfaces/igrid/igrid.js';
import './actions_grid.html';

Template.actions_grid.fn = {
    compare( a, b ){
        const ita = Articles.findOne({ _id: $( a ).attr( 'data-row-id' )});
        const itb = Articles.findOne({ _id: $( b ).attr( 'data-row-id' )});
        return compareUpdates( ita, itb );
    }
}

Template.actions_grid.onRendered( function(){
    //console.log( 'actions_grid.onRendered '+this.data.tab );
    this.$( '.js-grid' ).IGrid({
        sort: {
            compare: [
                {
                    column: 'created',
                    compare: Template.actions_grid.fn.compare
                },
                {
                    column: 'done',
                    compare: Template.actions_grid.fn.compare
                }
            ]
        }
    });
});

Template.actions_grid.helpers({
    getContext( it ){
        const context = Contexts.findOne({ _id: it.context });
        return context ? context.name : '';
    },
    getCreated( it ){
        return moment( it.createdAt ).format('DD/MM/GGGG');
    },
    getDone( it ){
        return moment( it.doneDate ).format('DD/MM/GGGG');
    },
    getName( it ){
        return it.name;
    },
    getParent( it ){
        const parent = Articles.findOne({ _id: it.parent });
        return parent ? parent.name : '';
    },
    getTopic( it ){
        const topic = Topics.findOne({ _id: it.topic });
        return topic ? topic.name : '';
    },
    // whether we are displaying the 'done' tab
    isDoneTab(){
        return this.tab === 'gtd-review-actions-done';
    }
});
