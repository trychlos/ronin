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
        let settings = Object.assign( {}, $.fn.IWindowed.defaults );
        $.extend( settings, opts );
        settings.widgetClass += ' '+_className( specs.template );
        if( !settings.group ){
            settings.group = specs.template;
        } else {
            settings.widgetClass += ' '+_className( settings.group );
        }
        //console.log( specs.template+' creating with settings='+JSON.stringify( settings ));
        settings.appendTo = '#'+g[LYT_WINDOW].rootId;
        settings.beforeClose = _beforeCloseEH;
        settings.close = _closeEH;
        settings.taskbar = g[LYT_WINDOW].taskbar.get();
        this.window( settings );
        this.data( 'iwindowed', specs.template );
        _restoreSettings( this, specs.template );
        // events tracker
        /*
        this.on( 'windowcreate', function( event, ui ){ // not received
            console.log( 'IWindowed create');
            console.log( event );
            console.log( ui );
        });
        this.on( 'windowclose', function( event, ui ){
            console.log( 'IWindowed close');
            console.log( event );
            console.log( ui );
        });
        */
       this.on( 'windowfocus', function( event, ui ){
        _onFocus( event, ui );
        });
        this.on( 'windowminimize', function( event, ui ){
            _onMinimize( event, ui );
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
    // return the class name added to the widget
    //  (aka the parent of the div we are working with)
    function _className( id ){
        return 'pwi-'+id;
    };
    // close the current window
    function _close( self ){
        if( $(self).data('iwindowed' )){
            $(self).window('close');
        } else {
            throwError({ message:'IWindowed: unable to close this window' });
        }
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
    // the window receives the focus
    //  update the current route
    function _onFocus( event, ui ){
        //console.log( 'focus '+ event.currentTarget.baseURI );
        const mode = $( event.target ).data( 'pwi-iroutable-mode' );
        if( mode === 'tabs' ){
            $.fn.ITabbed.focus( event.target );
        } else {
            if( mode === 'window' ){
                const route = $( event.target ).data( 'pwi-iroutable-route' );
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
    };
    // the window is minimized
    //  if all the windows are minimized, then reset the route
    function _onMinimize( event, ui ){
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
    // return the settings key when saving/restoring size and position
    function _settingsName( id ){
        return g[LYT_WINDOW].settingsPrefix+id;
    };
    // show a window, re-activating it or creating a new one
    // 0: name of the called method (show)
    // 1: template name to be rendered if not already exists
    function _show( self, args ){
        if( args.length != 2 ){
            throwError({ message: 'show expects 1 argument, '+( args.length-1 )+' found' });
        } else {
            //console.log( '_show searching for '+args[1] );
            const windows = g[LYT_WINDOW].taskbar.get().taskbar('windows');
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
    function _beforeCloseEH( ev ){
        //console.log( '_beforeCloseEH $(ev.target) '+$(ev.target).attr('class'));
        //console.log( '_beforeCloseEH $(this) '+$(this).attr('class'));
        _saveSettings( $(ev.target), $(ev.target).data('iwindowed'));
    };
    // the widget which encapsulates the window has been closed
    //  but the div itself is still in the DOM
    // $(ev.target) === ui.$window === jQuery object on which we have called window()
    function _closeEH( ev, ui ){
        //console.log( 'close event handler' );
        $(ev.target).remove();
    };
    // default values, overridable by the user at global level
    $.fn.IWindowed.defaults = {
        widgetClass:    'pwi-iwindowed',
        icons: {
            close:      'ui-icon-close',
            minimize:   'ui-icon-minus'
        }
    };
})( jQuery );
