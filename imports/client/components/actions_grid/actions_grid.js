/*
 * 'actions_grid' component.
 *  Display actions in a grid depending of their status.
 * 
 *  Parameters:
 *  - tab: the tab (aka the status) being displayed.
 *  - actions: the corresponding actions as a cursor.
 * 
 *  Session variables:
 *  - actions.tab.name: the current tab.
 */
import '/imports/client/third-party/jqwidgets/jqx.base.css';
import '/imports/client/third-party/jqwidgets/jqxcore.js';
import '/imports/client/third-party/jqwidgets/jqxbuttons.js';
import '/imports/client/third-party/jqwidgets/jqxdata.js';
import '/imports/client/third-party/jqwidgets/jqxdropdownlist.js';
import '/imports/client/third-party/jqwidgets/jqxgrid.js';
import '/imports/client/third-party/jqwidgets/jqxgrid.columnsresize.js';
import '/imports/client/third-party/jqwidgets/jqxgrid.filter.js';
import '/imports/client/third-party/jqwidgets/jqxgrid.grouping.js';
import '/imports/client/third-party/jqwidgets/jqxgrid.pager.js';
import '/imports/client/third-party/jqwidgets/jqxgrid.selection.js';
import '/imports/client/third-party/jqwidgets/jqxgrid.sort.js';
import '/imports/client/third-party/jqwidgets/jqxlistbox.js';
import '/imports/client/third-party/jqwidgets/jqxmenu.js';
import '/imports/client/third-party/jqwidgets/jqxscrollbar.js';
import './actions_grid.html';

Template.actions_grid.fn = {
    dict: {},
    grids: {
        'default': {
            columns: [
                { text:'Action', datafield:'name' },
                { text:'Topic', datafield:'topic' },
                { text:'Context', datafield:'context' },
                { text:'Project', datafield:'project' }
            ]
        }
    },
    getSettings: function( tab ){
        const keys = Object.keys( Template.actions_grid.fn.grids );
        for( var i=0 ; i<keys.length ; ++i ){
            if( keys[i] === tab ){
                return( Template.actions_grid.fn.grids[keys[i]] );
            }
        }
        return( Template.actions_grid.fn.grids.default );
    }
};

Template.actions_grid.onCreated( function(){
    // initialize our internal data for this tab
    const data = Template.currentData();
    if( data && data.tab ){
        Template.actions_grid.fn.dict[data.tab] = {
            grid: new ReactiveVar( null )
        }
    }
});

Template.actions_grid.onRendered( function(){
    // create the grid
    this.autorun(() => {
        const data = Template.currentData();
        if( data && data.tab ){
            const $grid = this.$('.grid');
            $grid.jqxGrid( Template.actions_grid.fn.getSettings( data.tab ));
            Template.actions_grid.fn.dict[data.tab].grid.set( $grid );
        }
    });
    // when actions are ready, populate the grid
    this.autorun(() => {
        const data = Template.currentData();
        //objDumpProps( data );
        //objDumpProps( data.actions );
        if( data && data.tab ){
            //console.log( data.tab );
            const $grid = Template.actions_grid.fn.dict[data.tab].grid.get();
            if( $grid && data.actions ){
                data.actions.forEach( it => {
                    //console.log( it.name );
                    $grid.jqxGrid( 'addrow', null, it );
                });
            }
        }
    });
});
