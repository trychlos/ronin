/*
 * 'contexts_grid' component.

 *  Display contexts in a grid.
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
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import './contexts_grid.html';

Template.contexts_grid.fn = {
    compare( a, b ){
        const ita = Topics.findOne({ _id: $( a ).attr( 'data-row-id' )});
        const itb = Topics.findOne({ _id: $( b ).attr( 'data-row-id' )});
        return compareUpdates( ita, itb );
    }
}

Template.contexts_grid.onRendered( function(){
    //console.log( 'topics_grid.onRendered '+this.data.tab );
    this.$( '.js-grid' ).IGrid({
        sort: {
            compare: [
                {
                    column: 'created',
                    compare: Template.contexts_grid.fn.compare
                }
            ]
        }
    });
});

Template.contexts_grid.helpers({
    getCreated( it ){
        return moment( it.updatedAt ? it.updatedAt : it.createdAt ).format('DD/MM/GGGG');
    },
    getName( it ){
        return it.name;
    },
    items(){
        return Contexts.find();
    }
});
