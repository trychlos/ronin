/*
 * 'IGrid' pseudo-interface.
 *  To be used by every tabular layout.
 *
 *  Usage:
 *  - the plugin must be first, and unless otherwise stated, called on the
 *    TABLE element
 *  - the plugin relies on the standard structure:
 *      <table>
 *          <thead></thead>
 *          <tbody></tbody>
 *      </table>
 *  - the TH element may hold the class 'igrid-sortable' which makes the column
 *    sortable
 *
 *  We set on the TABLE element:
 *  - one class:
 *      > ronin-igrid-table
 *  - one data:
 *      > <pluginName> = <plugin_object>
 *
 *  Modules story:
 *  1. first choice has been jqWidget jqxGrid.
 *     https://www.jqwidgets.com/jquery-widgets-documentation/documentation/jqxgrid/
 *     cancelled as too heavy, and unable to embed our action buttons.
 *  2. jQuery-bootgrid
 *     http://www.jquery-bootgrid.com/
 *     a nice example but that forces a header and a footer
 *  3. So just encapsulates the standard HTML layout.
 *
 *  Boilerplate from https://github.com/jquery-boilerplate/jquery-boilerplate/blob/master/src/jquery.boilerplate.js
 */

;( function( $, window, document ){
    "use strict";
    const pluginName = "IGrid";

    // The actual plugin constructor
    function myPlugin( element, options ){
        this.dom = element;
        this.$dom = $( this.dom );
        this.args = $.extend( {}, options || {} );
        this.settings =  $.extend( true, {}, $.fn[pluginName].defaults, this.args );
        this.columns = null;
        this._init( options );
    }

    // Avoid MyPlugin.prototype conflicts
    $.extend( myPlugin.prototype, {
        _init(){
            //console.log( this );
            // this = {
            //      dom         DOM callee element (not jQuery)
            //      args = {
            //          0: 'show',
            //          1: 'thoughtEdit'
            //      }
            //  }
            if( this.dom.nodeName === 'TABLE' ){
                this._create();
            }
        },
        // we have asked to show a new tabbed panel: create it
        _create(){
            this.$dom.addClass( 'ronin-igrid-table' );
            this.columns = this._readColumns();
            this._installSortButtons();
        },
        // Install a sort button on each column header which has the 'igrid-sortable' class
        //  Relies on the 'columns' array which must have been computed before this function
        _installSortButtons(){
            for( let i=0 ; i<this.columns.length ; ++i ){
                if( this.columns[i].hasClass( 'igrid-sortable' )){
                    this._installSortBtn( i, this.columns[i] );
                }
            }
        },
        // Install a sort button on the specified column
        //  idx is the index of the column, and acts as a local identifier
        //  column here is the TH jQuery element
        _installSortBtn( idx, $column ){
            const text = $column.text();
            $column.empty();
            $column.append( ''+
                '<div class="ronin-igrid-th d-flex flex-row justify-content-start align-items-center">'+
                    '<div class="ronin-igrid-name">'+text+'</div>'+
                    '<div class="ronin-igrid-sort-btn">'+
                        '<span class="'+this.settings.sort.icon.none+'"></span'+
                    '</div>'+
                '</div>'
            );
            $column.data( 'ronin-igrid-idx', idx );
            $column.find( '.ronin-igrid-sort-btn' ).attr( 'igrid-sort', 'none' );
            $column.find( '.ronin-igrid-sort-btn' ).click( this, function( ev ){
                const self = this;  // the .ronin-igrid-sort-btn DIV DOM element
                const plugin = ev.data;
                // get the initial value
                const prev = $( this ).attr( 'igrid-sort' );
                // reinit all sort buttons
                $( $( this ).parents( 'thead' )[0] ).find( 'th .ronin-igrid-sort-btn' ).each( function(){
                    $( this )
                        .attr( 'igrid-sort', 'none' )
                        .find( '>svg' )
                            .removeClass()
                            .addClass( plugin.settings.sort.icon.none );
                });
                // compute the next status
                let next = null;
                switch( prev ){
                    case 'none':
                        next = 'down';
                        break;
                    case 'down':
                        next = 'up';
                        break;
                    case 'up':
                        next = 'down';
                        break;
                }
                // and install it
                if( next ){
                    $( self )
                        .attr( 'igrid-sort', next )
                        .find( '>svg' )
                            .removeClass()
                            .addClass( plugin.settings.sort.icon[next] );
                }
                // actually sort (at last)
                //  from https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript
                const th = $( self ).parents( 'th' )[0];
                const idx = $( th ).data( 'ronin-igrid-idx' );
                const asc = ( next === 'up' ? 1 : -1 );
                // if the current field qualified by 'data-column-name' provides a compare function ?
                const _providedFn = () => {
                    const $th = plugin.columns[idx];
                    const name = $th.attr( 'data-column-name' );
                    if( name ){
                        for( let i=0 ; i<plugin.settings.sort.compare.length ; ++i ){
                            const cmp = plugin.settings.sort.compare[i];
                            if( cmp.column === name ){
                                return cmp.compare;
                            }
                        }
                    }
                    return null ;
                };
                const _getValue = ( tr ) => {
                    return( tr.children[idx].innerText || tr.children[idx].textContent );
                };
                const _compare = ( a, b ) => {
                    const fn = _providedFn();
                    if( fn ){
                        return asc*fn( a, b );
                    }
                    // a and b here are two TR DOM elements
                    const va = _getValue( a );
                    const vb = _getValue( b );
                    let ret = 0;
                    if( va ){
                        const vas = va.toString();
                        if( vb ){
                            ret = vas.localeCompare( vb );
                        } else {
                            ret = 1;
                        }
                    } else {
                        if( vb ){
                            ret = -1;
                        }
                    }
                    return asc*ret;
                }
                const table = $( self ).parents( 'table' )[0];
                const tbody = $( table ).find( 'tbody' )[0];
                Array.from( $( tbody ).find( 'tr' ))
                    .sort( _compare )
                    .forEach( tr => tbody.appendChild( tr ));
            });
        },
        // Returns an array of the defined columns as jQuery elements
        _readColumns(){
            let cols = [];
            this.$dom.find( 'thead>tr>th' ).each( function(){
                cols.push( $( this ));
            });
            return cols;
        }
    });

    $.fn[pluginName] = function(){
        //console.log( this );  // this is the jQuery element on which the interface is called
        const opts = Array.prototype.slice.call( arguments );
        //console.log( opts );
        this.each( function(){
            //console.log( this ); // this is the particular DOM element on which the interface will be applied
            // may or may not already been initialized
            const plugin = $( this ).data( pluginName );
            if( plugin ){
                //console.log( 'reusing already initialized plugin' );
                //console.log( opts );
                myPlugin.prototype._init.apply( plugin, opts );
            } else {
                //console.log( 'allocating new plugin instance' );
                $( this ).data( pluginName, new myPlugin( this, opts[0] ));
            }
        });
        return this;
    };

    // default values, overridable by the user at global level
    $.fn[pluginName].defaults = {
        sort: {
            icon: {
                none: 'fas fa-sort',
                down: 'fas fa-sort-down',
                up: 'fas fa-sort-up'
            },
            compare: []
        }
    };
})( jQuery, window, document );
