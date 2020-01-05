/*
 * 'IContextMenu' pseudo-interface.
 * 
 *  We have chosen to use the jQuery Simple ContentMenu plugin.
 *  See https://swisnl.github.io/jQuery-contextMenu/.
 * 
 *  Please note that, according to https://github.com/swisnl/jQuery-contextMenu/issues/355,
 *  there is no chance of being able to open this context menu at mmouse position :(
 * 
 *  Properties:
 *  + all jQuery ContextMenu options.
 */
import '/imports/client/components/errors/errors.js'

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
        // split between specific and Tabs properties
        //  Rationale: jqWidgets library refuse to work with extra props; jQuery not tested against
        const specifics = [
        ];
        let specs = {};
        const keys = Object.keys( opts );
        keys.forEach( key => {
            if( specifics.includes( key )){
                specs[key] = opts[key];
                delete opts[key];
            }
        });
        // set a 'pwi-icontextmenu' class on the root element
        //  if this class is already there, so this is not the first initialization
        //  else setup default values
        let settings = {};
        if( self.hasClass( 'pwi-icontextmenu' )){
            settings = Object.assign({}, opts );
        } else {
            settings = Object.assign({}, $.fn.IContextMenu.defaults );
            $.extend( settings, opts );
            self.addClass( 'pwi-icontextmenu' );
            /* doesn't work
            self.contextmenu( function( ev ){
                console.log( 'context menu' );
                objDumpProps( ev );
            });
            */
        }
        //console.log( 'jqxTabs settings='+JSON.stringify( settings ));
        self.contextMenu( settings );
        return this;
    };
    // default values, overridable by the user at global level
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
        autoHide: true,
        events: {
            show: function( opts ){
                this.addClass( 'contextmenu-showing' );
            },
            hide: function( opts ){
                this.removeClass( 'contextmenu-showing' );
            }
        },
        position: function( opt, x, y ){
            // opt: menu object
            //objDumpProps( opt );
            opt.$menu.position({
                my: 'left top',
                at: 'right bottom',
                of: opt.$trigger
            });
        }
    };
}( jQuery ));
