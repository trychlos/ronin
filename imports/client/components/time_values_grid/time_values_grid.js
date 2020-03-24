/*
 * 'time_values_grid' component.
 *
 *  Display time values in a grid.
 *
 *  NB: this time_values_grid is only displayed in windowLayout mode.
 *
 *  Rationale: see actions_grid.js
 *
 *  Parameters:
 *  - 'data': the layout context built in appLayout, and passed in by group layer.
 *
 *  Session variables:
 *  - setup.tab.name: the current tab.
 */
import { TimeValues } from '/imports/api/collections/time_values/time_values.js';
import '/imports/client/components/delete_button/delete_button.js';
import '/imports/client/components/edit_button/edit_button.js';
import '/imports/client/interfaces/igrid/igrid.js';
import './time_values_grid.html';

Template.time_values_grid.fn = {
    compare( a, b ){
        const ita = Topics.findOne({ _id: $( a ).attr( 'data-row-id' )});
        const itb = Topics.findOne({ _id: $( b ).attr( 'data-row-id' )});
        return compareUpdates( ita, itb );
    }
};

Template.time_values_grid.onRendered( function(){
    this.$( '.js-grid' ).IGrid({
        sort: {
            compare: [
                {
                    column: 'created',
                    compare: Template.time_values_grid.fn.compare
                }
            ]
        }
    });

    this.autorun(() => {
        $( '.time-values-grid' ).trigger( 'setup-tab-ready', {
            id: 'gtd-setup-time',
            count: TimeValues.find().count()
        });
    });
});

Template.time_values_grid.helpers({
    getCreated( it ){
        return moment( it.updatedAt ? it.updatedAt : it.createdAt ).format('DD/MM/GGGG');
    },
    items(){
        return TimeValues.find();
    }
});
