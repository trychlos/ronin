/*
 * 'iWindowed' pseudo-interface.
 *  To be used by every non modal window.
 *  This (pseudo-)interface manages the currently opened windows
 *  and makes sure that opened identifiers are kept unique.
 * 
 *  Each window must hold its own 'id' identifier; our window manager will take
 *  care of opening at most one identifier simultaneously, thus maybe reusing
 *  an already opened window.
 * 
 *  Properties:
 *  - id: mandatory, must be the template name
 *  + all simone options
 */
import '/imports/ui/components/errors/errors.js'

( function( $ ){
    $.fn.iWindowed = function(){
        if( !arguments.length ){
            throwError({ message: 'iWindowed interface requires at least one argument' });
            return this;
        }
        if( typeof arguments[0] === 'string' ){
            switch( arguments[0] ){
                case 'show':
                    _show( arguments );
                    break;
                default:
                    throwError({ message:'iWindowed: unknown method: '+arguments[0] });
            }
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
        // split between specific and window properties
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
        // create a new window, using global default values
        let settings = $.fn.iWindowed.defaults;
        $.extend( settings, opts );
        settings.group = specs.id;
        settings.widgetClass += ' '+_className( specs.id );
        //console.log( specs.id+' creating with settings='+JSON.stringify( settings ));
        settings.appendTo = '#'+g.rootId;
        settings.beforeClose = _beforeCloseEH;
        settings.close = _closeEH;
        settings.taskbar = g.taskbar.get();
        this.window( settings );
        this.data( 'iwindowed-id', specs.id );
        _restoreSettings( this, specs.id );
        return this;
    };
    // return the class name added to the widget
    //  (aka the parent of the div we are working with)
    function _className( id ){
        return 'ww-'+id;
    }
    // activate a window, first restoring it if it was minimized
    function _moveToTop( obj ){
        if( obj.window('minimized')){
            obj.window('restore');
        }
        obj.window('moveToTop');
    };
    // restore size and position
    function _restoreSettings( obj, id ){
        const storageName = _settingsName( id );
        if( localStorage[storageName] ){
            const settings = JSON.parse( localStorage[storageName] );
            //console.log( id+' _restoreSettings '+settings );
            obj.window( 'option', 'position', {
                my: settings.my,
                at: settings.at,
                of: window,
                collision: 'fit'
            });
            obj.window( 'option', 'width', settings.width );
            obj.window( 'option', 'height', settings.height );
            obj.window( 'refreshPosition' );
        }
    };
    // save size and position
    function _saveSettings( obj, id ){
        const position = obj.window( 'option', 'position' );
        let settings = {};
        settings.width = obj.window( 'option', 'width' );
        settings.height = obj.window( 'option', 'height' );
        settings.at = position.at;
        settings.my = position.my;
        const jsonSettings = JSON.stringify( settings );
        localStorage[_settingsName( id )] = jsonSettings;
        //console.log( id+' _saveSettings '+jsonSettings );
    };
    // return the settings key
    function _settingsName( id ){
        return g.settingsPrefix+id;
    };
    // show a window, re-activating it or creating a new one
    // 0: name of the called method (show)
    // 1: template name to be rendered if not already exists (aka window id)
    function _show( args ){
        if( args.length != 2 ){
            throwError({ message: 'show expects 1 argument, '+args.length-1+' found' });
        } else {
            //console.log( '_show searching for '+args[1] );
            const windows = g.taskbar.get().taskbar('windows');
            const searched = _className( args[1] );
            let found = false;
            for( var i=0 ; i<windows.length && !found ; ++i ){
                //console.log( 'i='+i+' window class='+$( windows[i] ).attr('class'));
                const widget = $( windows[i] ).window('widget');
                //console.log( 'i='+i+' widget class='+widget.attr('class'));
                if( widget.hasClass( searched )){
                    found = true;
                    //console.log( args[1]+' already exists, reusing' );
                    _moveToTop( $( windows[i] ));
                }
            }
            if( !found ){
                //console.log( args[1]+" didn't exist, creating" );
                Blaze.render( Template[args[1]], document.getElementById( g.rootId ));
            }
        }
    }
    function _beforeCloseEH( ev ){
        //console.log( '_beforeCloseEH $(ev.target) '+$(ev.target).attr('class'));
        //console.log( '_beforeCloseEH $(this) '+$(this).attr('class'));
        _saveSettings( $(ev.target), $(ev.target).data('iwindowed-id'));
    };
    function _closeEH( ev, ui ){
        //console.log( '_closeEH $(ev.target) '+$(ev.target).attr('class'));
        //console.log( '_closeEH '+ui.$window.attr('class')); // the same
    };
    // default values, overridable by the user at global level
    $.fn.iWindowed.defaults = {
        widgetClass: 'iwindowed'
    };
})( jQuery );
