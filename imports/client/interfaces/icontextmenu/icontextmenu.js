/*
 * 'IContextMenu' pseudo-interface.
 * 
 *  We have chosen to use the jQuery Simple ContextMenu plugin.
 *  See https://swisnl.github.io/jQuery-contextMenu/.
 *  Install: meteor npm install --save jquery-contextmenu
 * 
 *  Please note that, according to https://github.com/swisnl/jQuery-contextMenu/issues/355,
 *  opening this context menu at mouse position requires to built it just in time
 *  (on open event).
 *  As a consequence, only the 'selector' option is directly passed to the 'contextMenu'
 *  initialization method. All other options are integrated to the build() return values.
 * 
 *  The initialization must provide an object with following properties:
 *  - selector: mandatory
 *  - trigger (optional)
 *  - build (optional): will override the default return values of the build() method.
 */
import '/imports/client/components/errors/errors.js';

import 'jquery-contextmenu/dist/jquery.contextMenu.min.css';
import 'jquery-contextmenu/dist/jquery.contextMenu.min.js';
import 'jquery-contextmenu/dist/jquery.ui.position.min.js';

( function( $ ){
    $.fn.IContextMenu = function(){
        if( !this.length ){
            //throwError({ message: "no 'this' context here" });
            return;
        }
        const self = this;
        // are we calling a method on this interface ?
        if( arguments.length > 0 && typeof arguments[0] === 'string' ){
            const action = arguments[0];
            /* deal with action */
            return this;
        }
        const opts = arguments.length > 0 ? Object.assign({},arguments[0]) : {};
        /*
        // extract the options to be directly passed to the initialization function
        //  other options will be merged into the build() return value
        //  -> directOpts: options to be passed directly
        //  -> buildOpts: options to be merged in build() return value
        //  -> opts (initial value): left unchanged
        const directs = [
            'selector',
            'trigger'
        ];
        let directOpts = {};
        let buildOpts = Object.assign( {}, opts );
        const keys = Object.keys( buildOpts );
        keys.forEach( key => {
            if( directs.includes( key )){
                directOpts[key] = buildOpts[key];
                delete buildOpts[key];
            }
        });
        // set a 'pwi-icontextmenu' class on the root element
        //  if this class is already there, so this is not the first initialization
        //  else fill up build option with default values
        let settings = null;
        if( self.hasClass( 'pwi-icontextmenu' )){
            settings = Object.assign( {}, opts );
        } else {
            settings = Object.assign( {}, directOpts );
            let buildReturned = Object.assign( {}, $.fn.IContextMenu.defaults );
            Object.assign( buildReturned, buildOpts );
            settings.build = function( $elt, ev ){
                return ( function(){
                    return buildReturned;
                })();
            };
            self.addClass( 'pwi-icontextmenu' );
        }
        */
       let settings = Object.assign( {}, opts );
       console.log( 'contextMenu settings='+JSON.stringify( settings ));
        self.contextMenu( settings );
        return self;
    };
    // this is the build() default return value
    //  overridable by the user at global level
    $.fn.IContextMenu.defaults = {
        items: {
            edit: {
                name: 'Edit',
                icon: 'fas fa-edit'
            },
            delete: {
                name: 'Delete',
                icon: 'fas fa-trash-alt'
            }
        },
        // executed in the selector (triggering object) context
        callback: function( item, opts, menu, ev ){
            objDumpProps( item );
            objDumpProps( opts );
            objDumpProps( menu );
            objDumpProps( ev );
        },
        autoHide: true,
        // executed in the selector (triggering object) context
        events: {
            show: function( opts ){
                this.addClass( 'contextmenu-showing' );
            },
            hide: function( opts ){
                this.removeClass( 'contextmenu-showing' );
            }
        },
        position: function( opts, x, y ){
            opts.$menu.position({
                my: 'left top',
                at: 'right bottom',
                of: ev
            });
        }
    };
}( jQuery ));
