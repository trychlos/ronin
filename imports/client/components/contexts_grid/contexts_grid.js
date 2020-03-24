/*
 * 'contexts_grid' component.
 *
 *  Display contexts in a grid.
 *
 *  NB: this contexts_grid is only displayed in windowLayout mode.
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
import '/imports/client/components/delete_button/delete_button.js';
import '/imports/client/components/edit_button/edit_button.js';
import '/imports/client/interfaces/igrid/igrid.js';
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
    //console.log( this );

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

    this.autorun(() => {
        $( '.contexts-grid' ).trigger( 'setup-tab-ready', {
            id: 'gtd-setup-contexts',
            count: Contexts.find().count()
        });
    });
});

Template.contexts_grid.helpers({
    // template helper
    //  activates 'disabled' state if the item is non deletable
    isDeletable( it ){
        return '';
    },
    // template helper
    //  activates 'disabled' state if the item is non editable
    isEditable( it ){
        return '';
    },
    getCreated( it ){
        return moment( it.updatedAt ? it.updatedAt : it.createdAt ).format('DD/MM/GGGG');
    },
    items(){
        return Contexts.find();
    }
});
