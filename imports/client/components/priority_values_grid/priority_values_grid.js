/*
 * 'priority_values_grid' component.
 *
 *  Display priority values in a grid.
 *
 *  NB: this priority_values_grid is only displayed in windowLayout mode.
 *
 *  Rationale: see actions_grid.js
 *
 *  Parameters:
 *  - 'data' passed from setup_tabs:
 *      > gtd: the GTD item, here 'gtd-setup-contexts'
 *      > items: the cursor to the setup elements.
 *
 *  Session variables:
 *  - setup.tab.name: the current tab.
 */
import { PriorityValues } from '/imports/api/collections/priority_values/priority_values.js';
import '/imports/client/components/delete_button/delete_button.js';
import '/imports/client/components/edit_button/edit_button.js';
import '/imports/client/interfaces/igrid/igrid.js';
import './priority_values_grid.html';

Template.priority_values_grid.fn = {
    compare( a, b ){
        const ita = Topics.findOne({ _id: $( a ).attr( 'data-row-id' )});
        const itb = Topics.findOne({ _id: $( b ).attr( 'data-row-id' )});
        return compareUpdates( ita, itb );
    }
};

Template.priority_values_grid.onRendered( function(){
    this.$( '.js-grid' ).IGrid({
        sort: {
            compare: [
                {
                    column: 'created',
                    compare: Template.priority_values_grid.fn.compare
                }
            ]
        }
    });
});

Template.priority_values_grid.helpers({
    getCreated( it ){
        return moment( it.updatedAt ? it.updatedAt : it.createdAt ).format('DD/MM/GGGG');
    },
    items(){
        return PriorityValues.find();
    }
});
