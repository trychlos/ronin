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
 *  - 'data' passed from setup_tabs:
 *      > gtd: the GTD item, here 'gtd-setup-contexts'
 *      > items: the cursor to the setup elements.
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
});

Template.contexts_grid.helpers({
    // template helper
    //  attach a 'delete' action to the item, activating it if unused
    deleteAction( it ){
        let action = it.deleteAction || null;
        if( !action ){
            action = new Ronin.ActionEx({
                type: R_OBJ_CONTEXT,
                action: R_ACT_DELETE,
                gtd: 'gtd-setup-context-delete',
                item: it
            });
            it.deleteAction = action;
        }
        action.activable( !Boolean( it.useCount ));
        return action;
    },
    // template helper
    //  activates 'disabled' state if the item is non editable
    editAction( it ){
        let action = it.editAction || null;
        if( !action ){
            action = new Ronin.ActionEx({
                type: R_OBJ_CONTEXT,
                action: R_ACT_EDIT,
                gtd: 'gtd-setup-context-edit',
                item: it
            });
            it.editAction = action;
        }
        action.activable( true );
        return action;
    },
    // template helper
    //  activates 'disabled' state if the item is non deletable
    isDeletable( it ){
        return it.useCount ? 'disabled' : '';
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
