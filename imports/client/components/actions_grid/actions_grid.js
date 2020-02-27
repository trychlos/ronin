/*
 * 'actions_grid' component.
 *  Display actions in a grid depending of their status.
 *
 *  NB: this actionsGrid is only displayed in windowLayout mode.
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
import '/imports/client/interfaces/igrid/igrid.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './actions_grid.html';

Template.actions_grid.fn = {
    defineGrid: function( $grid ){
        let columns = [
            // IGrid pushes first 'edit' and last 'delete' button columns
            { text: '', width: 32, columntype: 'button',
                cellsrenderer: function( row, columnfield, value, defaulthtml, colproperties ){
                    let myClass = 'btn-disabled';
                    const current = Meteor.userId();
                    if( current ){
                        const item = $grid.IGrid( 'getrowdata', row );
                        myClass = current === item.userId ? 'btn-taken' : 'btn-takeable';
                    }
                    return ' <div class="'+myClass+'">' +
                                '<span class="fas fa-user-lock"></span>' +
                            '</div>';
                },
                // target=button element; currentTarget=grid element
                buttonclick: function( row, ev ){
                    //console.log( 'hey '+row );
                    $(ev.currentTarget).trigger( 'igrid-btnclick-ownership', row );
                }
            },
            { text: '', width: 32, columntype: 'button',
                cellsrenderer: function( row, columnfield, value, defaulthtml, colproperties ){
                    return ' <span class="fas fa-project-diagram"></span>';
                },
                buttonclick: function( row, ev ){
                    $(ev.currentTarget).trigger( 'igrid-btnclick-project', row );
                }
            },
            { text:'Action', datafield:'name' },
            { text:'Topic', datafield:'topicLabel' },
            { text:'Context', datafield:'contextLabel' },
            { text:'Project', datafield:'parentLabel' },
            { text:'Creation', datafield:'createdAt', cellsalign:'center', cellsformat:'dd/MM/yyyy', width:90 }
        ];
        if( $grid.data( 'tab' ) === 'actions-done' ){
            columns.push(
                { text:'Done', datafield:'doneDate', cellsalign:'center', cellsformat:'dd/MM/yyyy', width:90 }
            );
        }
        $grid.IGrid({ columns: columns });
    },
    // define a context menu on the rows
    // note that event passed to callback functions are the click on the menu item
    //  and note the click which opened the menu - so stay with build event.
    //  ev.target = li context menu element
    defineMenu: function( $grid ){
        const fn = Template.actions_grid.fn;
        $grid.contextMenu({
            selector: 'div.jqx-grid-content .jqx-grid-cell',
            build: function( $elt, ev ){
                return {
                    items: {
                        edit: {
                            name: 'Edit',
                            icon: 'fas fa-edit',
                            callback: function( item, opts, event ){
                                //console.log( ev );
                                const left = ev.originalEvent.clientX;
                                const top = ev.originalEvent.clientY;
                                //console.log( 'left='+left+' top='+top );
                                const cell = $grid.IGrid( 'getcellatposition', left, top );
                                //console.log( cell );
                                const row = cell ? $grid.IGrid( 'getrowdata', cell.row ) : null;
                                //console.log( row );
                                if( row ){
                                    fn.opeEdit( $grid, row );
                                }
                            }
                        },
                        delete: {
                            name: 'Delete',
                            icon: 'fas fa-trash-alt',
                            callback: function( item, opts, event ){
                                const cell = $grid.IGrid( 'getCellAtPosition', ev.pageX, ev.pageY );
                                const row = cell ? $grid.IGrid( 'getrowdata', cell.row ) : null;
                                if( row ){
                                    fn.opeDelete( $grid, row );
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
    },
    // delete the row in the grid, along with corresponding document server-side
    deleteRow: function( $grid, row ){
        Meteor.call( 'actions.remove', row );
    },
    // contextual menu, delete operation
    opeDelete: function( $grid, row ){
        //console.log( 'opeDelete tab='+tab+' row='+row.name );
        if( tab && row ){
            const fn = Template.actions_grid.fn;
            const msg = 'Are you sure you want to delete the \''+row.name+'\' action ?';
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
        }
    },
    // contextual menu, edit operation
    opeEdit: function( $grid, row ){
        //console.log( 'opeEdit tab='+tab+' row='+row.name );
        row.type = 'A';
        Session.set( 'process.edit.obj', row );
        $grid.IWindowed( 'showNew', 'editWindow' );
    }
};

Template.actions_grid.onCreated( function(){
    // initialize our internal data for this tab
    const data = Template.currentData();
    if( data && data.tab ){
        this.ronin = new ReactiveDict();
        this.ronin.set( 'ready', false );
        this.ronin_handles = [
            this.subscribe( 'contexts.all' ),
            this.subscribe( 'articles.projects.all' ),
            this.subscribe( 'topics.all' )
        ]
    }
});

Template.actions_grid.onRendered( function(){
    const fn = Template.actions_grid.fn;
    const data = Template.currentData();
    const self = this;
    let $grid = null;

    // create the grid
    if( data && data.tab ){
        $grid = $('#'+data.tab+' .grid');
        $grid.data( 'tab', data.tab );
        fn.defineGrid( $grid );
        fn.defineMenu( $grid );
    }
    // wait for all subscriptions are ready
    this.autorun(() => {
        if( self.ronin ){
            let ready = self.ronin.get( 'ready' );
            if( !ready ){
                ready = true;
                self.ronin_handles.forEach( it => {
                    ready &= it.ready();
                });
                self.ronin.set( 'ready', ready );
            }
        }
    });
    // when actions are ready, populate the grid
    this.autorun(() => {
        if( self.ronin && self.ronin.get( 'ready' ) && $grid ){
            $grid.IGrid( 'clear' );
            data.actions.forEach( it => {
                //console.log( it.name );
                let obj = Object.assign( {}, it );
                const context = Contexts.findOne({ _id: it.context });
                obj.contextLabel = context ? context.name : '';
                const parent = Articles.findOne({ _id: it.parent });
                obj.parentLabel = parent ? parent.name : '';
                const topic = Topics.findOne({ _id: it.topic });
                obj.topicLabel = topic ? topic.name : '';
                $grid.IGrid( 'addrow', it._id, obj );
            });
        }
    });
});

Template.actions_grid.events({
    'igrid-btnclick-delete .grid'( ev, instance, rowIndex ){
        //console.log( rowIndex );
        const $grid = instance.$( ev.target );
        const row = $grid.IGrid( 'getrowdata', rowIndex );
        Template.actions_grid.fn.opeDelete( $grid, row );
    },
    'igrid-btnclick-edit .grid'( ev, instance, rowIndex ){
        //console.log( arguments );
        //console.log( rowIndex );
        const $grid = instance.$( ev.target );
        const row = $grid.IGrid( 'getrowdata', rowIndex );
        Template.actions_grid.fn.opeEdit( $grid, row );
    },
    'igrid-btnclick-ownership .grid'( ev, instance, rowIndex ){
        const $grid = instance.$( ev.target );
        const row = $grid.IGrid( 'getrowdata', rowIndex );
        //Template.actions_grid.fn.opeDelete( $grid, row );
    },
    'igrid-btnclick-project .grid'( ev, instance, rowIndex ){
        const $grid = instance.$( ev.target );
        const row = $grid.IGrid( 'getrowdata', rowIndex );
        //Template.actions_grid.fn.opeDelete( $grid, row );
    }
});
