/*
 * 'IGrid' pseudo-interface.
 *  To be used by every grid window.
 * 
 *  We have chosen to use jqWidget jqxGrid.
 *  See https://www.jqwidgets.com/jquery-widgets-documentation/documentation/jqxgrid/.
 * 
 *  More, IGrid expects that each <li> holds a 'data-igrid'
 *  attribute, with the tab identifier as a value.
 * 
 *  Arguments:
 *  - if first argument is a string, all arguments will be directly passed to
 *      jqxGrid (as is)
 *  - else first argument must be an object and be the only one argument
 *      > if this object contains a 'columns' key, then it is interpreted as
 *          settings of a grid definition
 *      > else, it is directly passed to jqxGrid (as is).
 */
import '/imports/client/components/errors/errors.js'
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

( function( $ ){
    $.fn.IGrid = function(){
        if( !this.length || !arguments.length ){
            //throwError({ message: "no 'this' context here" });
            return;
        }
        const self = this;
        // are we calling a method on this interface ?
        //  this is the only situation where we accept more than one argument
        if( typeof arguments[0] === 'string' ){
            self.jqxGrid.apply( self, arguments );
            return self;
        }
        if( arguments.length > 1 ){
            throwError({ message: "Igrid: only one argument expected when not calling a method" });
            return self;
        }
        if( typeof arguments[0] !== 'object' ){
            throwError({ message: "IGrid: unexpected argument: "+ typeof arguments[0] });
            return self;
        }
        if( Object.keys( arguments[0] ).includes( 'columns' )){
            arguments[0].columns.unshift({ text:'E' });  // edit button
            arguments[0].columns.push({ text:'D' });     // delete button
            let settings = Object.assign( {}, arguments[0] )
            Object.assign( settings, {
                columnsheight: 28,
                columnsresize: true,
                sortable: true,
                width: '100%'
            });
            //console.log( 'jqxGrid settings='+JSON.stringify( settings ));
            self.jqxGrid( settings );
            self.addClass( 'pwi-igrid' );
            self.parent().css({
                'margin-top': '0.25em',
                'margin-right': '0.25em'
            });
        } else {
            self.jqxGrid( arguments[0] );
        }
        return self;
    }
}( jQuery ));
