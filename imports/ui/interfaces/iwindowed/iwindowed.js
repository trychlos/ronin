/*
 * 'iWindowed' pseudo-interface.
 *  To be used by every non modal (jqxWindow-based) window.
 *  This (pseudo-)interface manages the currently opened windows
 *  and makes sure that opened identifiers are kept uniques.
 * 
 *  Each window must hold its own 'id' identifier; our window manager will take
 *  care of opening at most one identifier simultaneously, thus maybe reusing
 *  an already opened window.
 * 
 *  Properties:
 *  - id: mandatory
 *  + all jqxWindow options
 */
import '/imports/ui/components/errors/errors.js'
import '/imports/ui/third-party/jqwidgets/jqwidgets/styles/jqx.base.css';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxcore.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxwindow.js';

( function( $ ){
    $.fn.iWindowed = function(){
        if( !arguments.length ){
            throwError({ message: 'iWindowed interface requires at least one argument' });
            return this;
        }
        if( typeof arguments[0] === 'string' ){
            const action = arguments[0];
            /* deal with action */
            return this;
        }
        if( arguments.length != 1 ){
            throwError({ message:'iWindowed: options object expected, not found' });
            return this;
        }
        const opts = arguments[0];
        if( !opts.id ){
            throwError({ message:'iWindowed: identifier not set' });
            return this;
        }
        // split between specific and jqxWindow properties
        //  Rationale: jqWidgets library refuse to work with extra props
        const specifics = [
            'id'
        ];
        let specs = {};
        const keys = Object.keys( opts );
        keys.forEach( key => {
            if( specifics.includes( key )){
                specs[key] = opts[key];
                delete opts[key];
            }
        });
        // reuse an already existing window
        if( $.fn.iWindowed.opened.includes( specs.id )){
            console.log( specs.id+' already exists, reusing with opts='+JSON.stringify( opts ));
            this.jqxWindow( opts );
        // create a new window, using global default values
        } else {
            this.addClass( 'iwindowed' );
            let settings = $.fn.iWindowed.defaults;
            $.extend( settings, opts );
            console.log( specs.id+' creating with settings='+JSON.stringify( settings ));
            this.jqxWindow( settings );
            $.fn.iWindowed.opened.push( specs.id );
            console.log( specs.id+" didn't exist, created, opened="+JSON.stringify( $.fn.iWindowed.opened ));
        }
        return this;
    };
    // list of currently opened jqxWindow's
    $.fn.iWindowed.opened = new Array();
    // default values, overridable by the user at global level
    $.fn.iWindowed.defaults = {
        width: 640,
        height: 480,
        showCollapseButton: true
    };
})( jQuery );
