/*
 * 'topics_grid' component.

 *  Display topics in a grid.
 *
 *  NB: this topics_grid is only displayed in windowLayout mode.
 *
 *  Rationale: see actions_grid.js
 *
 *  Parameters:
 *  - 'data': the layout context built in appLayout, and passed in by group layer.
 *
 *  Session variables:
 *  - setup.tab.name: the current tab.
 */
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/client/components/delete_button/delete_button.js';
import '/imports/client/components/edit_button/edit_button.js';
import '/imports/client/interfaces/igrid/igrid.js';
import './topics_grid.html';

Template.topics_grid.fn = {
    compare( a, b ){
        const ita = Topics.findOne({ _id: $( a ).attr( 'data-row-id' )});
        const itb = Topics.findOne({ _id: $( b ).attr( 'data-row-id' )});
        return compareUpdates( ita, itb );
    }
}

Template.topics_grid.onRendered( function(){
    //console.log( 'topics_grid.onRendered '+this.data.gtdid );

    this.$( '.js-grid' ).IGrid({
        sort: {
            compare: [
                {
                    column: 'created',
                    compare: Template.topics_grid.fn.compare
                }
            ]
        }
    });
});

Template.topics_grid.helpers({
    getCreated( it ){
        return moment( it.updatedAt ? it.updatedAt : it.createdAt ).format('DD/MM/GGGG');
    },
    getName( it ){
        return it.name;
    },
    items(){
        return Topics.find();
    }
});
