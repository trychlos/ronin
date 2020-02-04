/*
 * 'IWindowed' pseudo-interface.
 *  To be used by every non modal window.
 *  This (pseudo-)interface manages the currently opened windows
 *  and makes sure that opened identifiers are kept unique.
 *
 *  Each window must hold its own 'id' identifier; our window manager will take
 *  care of opening at most one identifier simultaneously, thus maybe reusing
 *  an already opened window.
 *
 *  Semantic:
 *  - the 'widget' is created by Simone window manager, around our 'window'
 *      and holds the titlebar, the min/max/restore/close buttons and the
 *      margins
 *  - the 'window' is the <div> we have applied the window() function on, and
 *      on which we are working.
 *
 *  We set:
 *  - on the widget, three classes:
 *      > ronin-iwm
 *      > ronin-iwm-<gtd_features_group>
 *      > ronin-iwm-<window_template_name>
 *  - on the window, two data attributes:
 *      > ronin-iwm-id = <window_template_name>
 *      > ronin-iwm-route = last known route name.
 *
 *  Properties:
 *  - template: mandatory, the template name
 *  + all simone options
 */
import { gtd } from '/imports/assets/gtd/gtd.js';
import '/imports/client/interfaces/itabbed/itabbed.js'

( function( $ ){
    $.fn.IWindowed = function(){
        if( !arguments.length ){
            throwError({ message: 'IWindowed interface requires at least one argument' });
            return this;
        }
        if( typeof arguments[0] === 'string' ){
            switch( arguments[0] ){
                case 'close':
                    _close( this, arguments );
                    break;
                case 'minimizeAll':
                    _minimizeAll();
                    break;
                case 'show':
                    _show( this, arguments );
                    break;
                case 'showNew':
                    _showNew( this, arguments );
                    break;
                default:
                    throwError({ message:'IWindowed: unknown method: '+arguments[0] });
            }
            return this;
        }
        if( arguments.length != 1 ){
            throwError({ message:'IWindowed: options object expected, not found' });
            return this;
        }
        const opts = Object.assign( {}, arguments[0] );
        if( !opts.template ){
            throwError({ message:'IWindowed: template name not set' });
            return this;
        }
        // split between specific and window properties
        const specifics = [
            'template'
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
        //  we set on the window's widget a 'ronin-iwm-<template_name>' class
        //  plus maybe a 'ronin-iwm-<group>' one if different of the template name
        let settings = Object.assign( {}, $.fn.IWindowed.defaults );
        $.extend( settings, opts );
        settings.widgetClass += ' '+_className( specs.template );
        if( !settings.group ){
            settings.group = specs.template;
        } else {
            settings.widgetClass += ' '+_className( settings.group );
        }
        $.extend( settings, {
            appendTo:     '#'+g[LYT_WINDOW].rootId,
            beforeClose:  _beforeCloseEH,
            close:        _closeEH,
            taskbar:       g[LYT_WINDOW].taskbar.get()
        });
        //console.log( settings );
        this.window( settings );
        _idSet( this, specs.template );
        _routeSet( this );
        _restoreSettings( this, specs.template );
        // events tracker
        this.on( 'windowdragstop', function( event, ui ){
            _onDragStop( event, ui );
        });
        this.on( 'windowfocus', function( event, ui ){
            _onFocus( event, ui );
        });
        this.on( 'windowminimize', function( event, ui ){
            _onMinimize( event, ui );
        });
        this.on( 'windowresizestop', function( event, ui ){
            _onResizeStop( event, ui );
        });
        /*
        this.on( 'windowmoveToTop', function( event, ui ){ // not received
            console.log( 'IWindowed moveToTop');
            console.log( event );
            console.log( ui );
        });
        */
        return this;
    };
    function _beforeCloseEH( ev ){
        _saveSettings( $( ev.target ), _idGet( $( ev.target )));
    };
    // return the name of the class added to the widget
    //  (aka the parent of the div we are working with)
    //  to be kept close of $.fn.IWindowed.defaults.widgetClass
    function _className( id ){
        return 'ronin-iwm-'+id;
    };
    // close the current window
    function _close( self ){
        if( _idGet( $( self ))){
            $(self).window('close');
        } else {
            throwError({ message:'IWindowed: unable to close this window' });
        }
    };
    // the widget which encapsulates the window has been closed
    //  but the div itself is still in the DOM
    // $(ev.target) === ui.$window === jQuery object on which we have called window()
    function _closeEH( ev, ui ){
        //console.log( 'close event handler' );
        $( ev.target ).remove();
    };
    // returns the identifier set as a data attribute of the window
    function _idGet( window ){
        return window.data( 'ronin-iwm-id' );
    };
    // setup the identifier of the window
    function _idSet( window, id ){
        window.data( 'ronin-iwm-id', id );
    };
    // minimize all windows
    function _minimizeAll( self ){
        const taskbar = g[LYT_WINDOW].taskbar.get();
        if( taskbar ){
            const windows = taskbar.taskbar( 'windows' );
            for( let i=0 ; i<windows.length ; ++i ){
                $( windows[i] ).window( 'minimize' );
            }
        }
    };
    // activate a window, first restoring it if it was minimized
    function _moveToTop( obj ){
        if( obj.window('minimized')){
            obj.window('restore');
        }
        obj.window('moveToTop');
    };
    function _onDragStop( ev, ui ){
        _saveSettings( $( ev.target ), _idGet( $( ev.target )));
    };
    // the window receives the focus
    //  update the current route
    function _onFocus( ev, ui ){
        _saveSettings( $( ev.target ), _idGet( $( ev.target )));
        const route = $( ev.target ).data( 'ronin-iwm-route' );
        if( route ){
            FlowRouter.go( route );
        }
        /*
        const mode = $( ev.target ).data( 'pwi-iroutable-mode' );
        if( mode === 'tabs' ){
            $.fn.ITabbed.focus( ev.target );
        } else {
            if( mode === 'window' ){
                const route = $( ev.target ).data( 'pwi-iroutable-route' );
                if( route ){
                    FlowRouter.go( route );
                } else {
                    console.log( 'IWindowed:onFocus() mode=window but no route is defined' );
                }
            } else {
                console.log( 'IWindowed:onFocus() unknown mode='+mode);
                //console.log( event );
                //console.log( ui );
            }
        }
        */
    };
    // the window is minimized
    //  if all the windows are minimized, then reset the route
    function _onMinimize( ev, ui ){
        const windows = ui.taskbar.windows();
        let visible = 0;
        for( let i=0 ; i<windows.length ; ++i ){
            //console.log( windows[i] );
            if( !$( windows[i] ).window( 'minimized' )){
                visible += 1;
            }
        }
        //console.log( 'windows.length='+windows.length+' visible='+visible );
        if( !visible ){
            FlowRouter.go( 'home' );
        }
    };
    // the window has been resize
    function _onResizeStop( ev, ui ){
        _saveSettings( $( ev.target ), _idGet( $( ev.target )));
    };
    // restore size and position
    function _restoreSettings( obj, id ){
        const storageName = _settingsName( id );
        if( localStorage[storageName] ){
            const settings = JSON.parse( localStorage[storageName] );
            //console.log( '_restoreSettings '+storageName );
            //console.log( settings );
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
    // returns the last known route
    function _routeGet( window ){
        return $( window ).data( 'ronin-iwm-route' );
    };
    // at creation time, set the current route name as a window data attribute
    function _routeSet( window ){
        const route = FlowRouter.getRouteName();
        $( window ).data( 'ronin-iwm-route', route );
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
        const storageName = _settingsName( id );
        localStorage[storageName] = jsonSettings;
        //console.log( '_saveSettings '+storageName );
        //console.log( jsonSettings );
    };
    // return the settings key when saving/restoring size and position
    function _settingsName( id ){
        return 'spSettings-'+id;
    };
    // show a window, re-activating it or creating a new one
    // 0: name of the called method (show)
    // 1: template name to be rendered if not already exists
    //  our wm-managed window's widgets hold a 'ronin-iwm-<template_name>' class
    function _show( self, args ){
        if( args.length != 2 ){
            throwError({ message: 'show expects 1 argument, '+( args.length-1 )+' found' });
        } else {
            const windows = g[LYT_WINDOW].taskbar.get().taskbar('windows');
            const searched = _className( args[1] );
            let found = false;
            for( var i=0 ; i<windows.length && !found ; ++i ){
                const widget = $( windows[i] ).window('widget');
                if( widget.hasClass( searched )){
                    found = true;
                    //console.log( searched+' already exists, reusing' );
                    _moveToTop( $( windows[i] ));
                }
            }
            if( !found ){
                //console.log( searched+" didn't exist, creating" );
                Blaze.render( Template[args[1]], document.getElementById( g[LYT_WINDOW].rootId ));
            }
        }
    };
    // show unconditionally a new window
    // 0: name of the called method (showNew)
    // 1: template name to be rendered
    function _showNew( self, args ){
        if( args.length != 2 ){
            throwError({ message: 'showNew expects 1 argument, '+( args.length-1 )+' found' });
        } else {
            //console.log( 'IWindowed.showNew '+args[1] );
            Blaze.render( Template[args[1]], document.getElementById( g[LYT_WINDOW].rootId ));
        }
    };
    // default values, overridable by the user at global level
    $.fn.IWindowed.defaults = {
        widgetClass:    'ronin-iwm',
        icons: {
            close:      'ui-icon-close',
            minimize:   'ui-icon-minus'
        }
    };
})( jQuery );
