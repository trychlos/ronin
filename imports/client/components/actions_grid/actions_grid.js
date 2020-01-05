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
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import { Projects } from '/imports/api/collections/projects/projects.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
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
                { text:'Topic', datafield:'topicLabel' },
                { text:'Context', datafield:'contextLabel' },
                { text:'Project', datafield:'projectLabel' },
                { text:'Creation', datafield:'createdAt', cellsalign:'center', cellsformat:'dd/MM/yyyy', width:75 }
            ],
            columnsresize: true,
            sortable: true
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
    },
    // delete the row in the grid, along with corresponding document server-side
    deleteRow: function( $grid, row ){
        Meteor.call( 'actions.remove', row._id );
    },
    // contextual menu, delete operation
    opeDelete: function( tab, row ){
        //console.log( 'opeDelete tab='+tab+' row='+row.name );
        const fn = Template.actions_grid.fn;
        const msg = 'Are you sure you want to delete the \''+row.name+'\' action ?';
        const $grid = fn.dict[tab].grid.get();
        $grid.parent().append('<div class="dialog"></div>');
        const $dialog = $('.actions-grid .dialog');
        $dialog.text( msg );
        $dialog.dialog({
            buttons: [
                {
                    text: 'Delete',
                    click: function(){
                        fn.deleteRow( $grid, row );
                        $( this ).dialog( 'close' );
                }},
                {
                    text: 'Cancel',
                    click: function(){
                        $( this ).dialog( 'close' );
                }}
            ],
            modal: true,
            resizable: false,
            title: 'Confirmation is requested',
            width: 400
    });
},
    // contextual menu, edit operation
    opeEdit: function( tab, row ){
        //console.log( 'opeEdit tab='+tab+' row='+row.name );
        const $grid = Template.actions_grid.fn.dict[tab].grid.get();
        row.type = 'A';
        Session.set( 'process.edit.obj', row );
        $grid.IWindowed( 'showNew', 'editWindow' );
    }
};

Template.actions_grid.onCreated( function(){
    // initialize our internal data for this tab
    const data = Template.currentData();
    if( data && data.tab ){
        Template.actions_grid.fn.dict[data.tab] = {
            grid: new ReactiveVar( null ),
            handles: [
                this.subscribe( 'contexts.all' ),
                this.subscribe( 'projects.all' ),
                this.subscribe( 'topics.all' )
            ],
            ready: new ReactiveVar( false ),
            rowIndex: null
        }
    }
});

Template.actions_grid.onRendered( function(){
    const fn = Template.actions_grid.fn;
    const self = this;
    // create the grid
    this.autorun(() => {
        const data = Template.currentData();
        if( data && data.tab ){
            const $grid = this.$('.grid');
            $grid.jqxGrid( fn.getSettings( data.tab ));
            // on each click on a row, store the corresponding rowindex
            //  this is a sort of hack as context menu does not provide that
            $grid.on( 'rowclick', function( ev ){
                fn.dict[data.tab].rowIndex = ev.args.rowindex;
            });
            fn.dict[data.tab].grid.set( $grid );
            // define a context menu on the rows
            // note that event passed to callback functions are the click on the menu item
            //  and note the click which opened the menu - so stay with build event.
            $grid.contextMenu({
                selector: 'div.jqx-grid-content .jqx-grid-cell',
                build: function( $elt, ev ){
                    return {
                        items: {
                            edit: {
                                name: 'Edit',
                                icon: 'fas fa-edit',
                                callback: function( item, opts, event ){
                                    const cell = $grid.jqxGrid( 'getCellAtPosition', ev.pageX, ev.pageY );
                                    const row = cell ? $grid.jqxGrid( 'getrowdata', cell.row ) : null;
                                    if( row ){
                                        fn.opeEdit( data.tab, row );
                                    }
                                }
                            },
                            delete: {
                                name: 'Delete',
                                icon: 'fas fa-trash-alt',
                                callback: function( item, opts, event ){
                                    const cell = $grid.jqxGrid( 'getCellAtPosition', ev.pageX, ev.pageY );
                                    const row = cell ? $grid.jqxGrid( 'getrowdata', cell.row ) : null;
                                    if( row ){
                                        fn.opeDelete( data.tab, row );
                                    }
                                }
                            }
                        },
                        autoHide: true,
                        // executed in the selector (triggering object) context
                        events: {
                            show: function( opts ){
                                $(this.parents('div[role*=row]')[0]).addClass( 'contextmenu-showing' );
                            },
                            hide: function( opts ){
                                $(this.parents('div[role*=row]')[0]).removeClass( 'contextmenu-showing' );
                            }
                        },
                        position: function( opts, x, y ){
                            opts.$menu.position({
                                my: 'left top',
                                at: 'right bottom',
                                of: ev
                            });
                        }
                    }
                }
            });
        }
    });
    // wait for all subscriptions are ready
    this.autorun(() => {
        const data = Template.currentData();
        if( data && data.tab ){
            let ready = fn.dict[data.tab].ready.get();
            if( !ready ){
                ready = true;
                fn.dict[data.tab].handles.forEach( it => {
                    ready &= it.ready();
                });
                fn.dict[data.tab].ready.set( ready );
            }
        }
    });
    // when actions are ready, populate the grid
    this.autorun(() => {
        const data = Template.currentData();
        if( data && data.tab ){
            const $grid = fn.dict[data.tab].grid.get();
            const ready = fn.dict[data.tab].ready.get();
            if( $grid && ready && data.actions ){
                $grid.jqxGrid( 'clear' );
                data.actions.forEach( it => {
                    //console.log( it.name );
                    let obj = Object.assign( {}, it );
                    const context = Contexts.findOne({ _id: it.context });
                    obj.contextLabel = context ? context.name : '';
                    const project = Projects.findOne({ _id: it.project });
                    obj.projectLabel = project ? project.name : '';
                    const topic = Topics.findOne({ _id: it.topic });
                    obj.topicLabel = topic ? topic.name : '';
                    $grid.jqxGrid( 'addrow', it._id, obj );
                });
            }
        }
    });
});
