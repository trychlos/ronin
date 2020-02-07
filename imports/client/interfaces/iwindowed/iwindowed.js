/*
 * 'IWindowed' pseudo-interface.
 *  To be used by every non modal window.
 *  This (pseudo-)interface is implemented as a jQuery plugin. It manages the
 *  currently opened windows, making sure that opened  windows are kept unique
 *  unless otherwise specified.
 *
 *  Windows default to be identified by their template name; this interface takes
 *  care of opening at most one identifier simultaneously, thus maybe reusing an
 *  already opened window.
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
 *      > ronin-iwm-widget
 *      > ronin-iwm-<gtd_features_group> (aka setup, collect, process, review)
 *      > ronin-iwm-<window_template_name> (e.g. thoughtsList, thoughtEdit, etc.)
 *  - on the window, one class:
 *      > ronin-iwm-window
 *  - on the window, two data attributes:
 *      > data-ronin-iwm-id = <window_template_name>
 *      > data-ronin-iwm-route = last known route name.
 *
 *  ronin-iwm-<route> rationale
 *      In a window-based layout, we need to reactively adapt the current route
 *      (aka URL) to the focused window.
 *      Recording the current route at window creation, i.e. the route which has
 *      led to this window, is a good default.
 *      ITabbed windows should also adapt this window attribute when the tab is
 *      switched by the user.
 *
 *  Properties:
 *  - template: mandatory, the template name
 *      this is the default identifier
 *  + all simone options
 *
 *  From https://github.com/jquery-boilerplate/jquery-boilerplate/blob/master/src/jquery.boilerplate.js
 */
;( function( $, window, document ){
    "use strict";
    const pluginName = "IWindowed";

    // The actual plugin constructor
    function Plugin( element, options ){
        this.dom = element;
        this.args = options;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend( Plugin.prototype, {
        init: function(){
            // this = {
            //      dom         DOM callee element (not jQuery)
            //      args = {
            //          0: 'show',
            //          1: 'thoughtEdit'
            //      }
            //  }
            let argsCount = Object.keys( this.args ).length;
            if( !argsCount ){
                throwError({ message: 'IWindowed interface requires at least one argument' });
                return;
            }
            if( typeof this.args[0] === 'string' ){
                switch( this.args[0] ){
                    case 'close':
                        this.close( argsCount );
                        break;
                    case 'minimizeAll':
                        this.minimizeAll( argsCount );
                        break;
                    case 'setRoute':
                        this.setRoute( argsCount );
                        break;
                    case 'show':
                        this.show( argsCount );
                        break;
                    case 'showNew':
                        this.showNew( argsCount );
                        break;
                    default:
                        throwError({ message:'IWindowed: unknown method: '+this.args[0] });
                }
                return;
            }
            if( argsCount != 1 || typeof this.args[0] !== 'object' ){
                throwError({ message:'IWindowed: options object expected, not found' });
                return;
            }
            this._create();
        },
        // return the name of the class added to the widget
        //  (aka the parent of the div we are working with)
        //  to be kept close of $.fn.IWindowed.defaults.widgetClass
        _className: function( id ){
            return 'ronin-iwm-'+id;
        },
        // we have asked to show a new window: create it
        _create: function(){
            //console.log( this );
            const args = this.args[0];
            if( !args.template ){
                throwError({ message:'IWindowed: template name not set' });
                return;
            }
            // we set on the window's widget a 'ronin-iwm-<template_name>' class
            //  plus maybe a 'ronin-iwm-<group>' one if specified and different
            //  of the template name
            let settings = $.extend( true, {}, args, $.fn[pluginName].defaults, {
                simone: {
                    appendTo:     '#'+g[LYT_WINDOW].rootId,
                    beforeClose:  this._onBeforeClose,
                    close:        this._onClose,
                    taskbar:       g[LYT_WINDOW].taskbar.get()
                }
            });
            settings.simone.widgetClass += ' '+this._className( args.template );
            if( args.simone.group ){
                if( args.simone.group !== args.template ){
                    settings.simone.widgetClass += ' '+this._className( args.simone.group );
                }
            } else {
                settings.simone.group = args.template;
            }
            //console.log( settings );
            $( this.dom ).window( settings.simone );
            $( this.dom ).addClass( 'ronin-iwm-window' );
            // set some data- attributes on the window
            //  we prefer data- attributes as set by attr() method as they are available
            //  as standard jQuery selector, and visible in the console log
            //  contrarily data() set the data inside of an invisible storage space
            const id = this.args[0].template;
            this._idSet( id );
            this._routeSet();
            this._restoreSettings( id );
            // set event handlers
            //  passing this to the handler, getting back in event.data
            //  in the handler, this is the attached dom element
            $( this.dom ).on( 'windowdragstop', this, function( ev, ui ){
                ev.data._onDragStop( ev, ui );
            });
            $( this.dom ).on( 'windowfocus', this, function( ev, ui ){
                ev.data._onFocus( ev, ui );
            });
            $( this.dom ).on( 'windowminimize', this, function( ev, ui ){
                ev.data._onMinimize( ev, ui );
            });
            $( this.dom ).on( 'windowresizestop', this, function( ev, ui ){
                ev.data._onResizeStop( ev, ui );
            });
            //console.log( $( this.dom ));
        },
        // returns the identifier set as a data attribute of the window
        _idGet: function(){
            return $( this.dom ).attr( 'data-ronin-iwm-id' );
        },
        // setup the identifier of the window
        _idSet: function( id ){
            $( this.dom ).attr( 'data-ronin-iwm-id', id );
        },
        // activate a window, first restoring it if it was minimized
        _moveToTop: function( obj ){
            if( obj.window('minimized')){
                obj.window('restore');
            }
            obj.window('moveToTop');
        },
        _onBeforeClose: function( ev, ui ){
            this._saveSettings();
        },
        // the widget which encapsulates the window has been closed
        //  but the div itself is still in the DOM
        // $(ev.target) === ui.$window === jQuery object on which we have called window()
        _onClose: function( ev, ui ){
            console.log( 'close event handler' );
            $( ev.target ).remove();
        },
        _onDragStop: function( ev, ui ){
            //console.log( '_onDragStop '+$( ev.target ).data( 'ronin-iwm-id' ));
            this._saveSettings();
        },
        // the window receives the focus
        //  update the current route
        //  NB: focus is triggered twice when activated from the taskbar
        _onFocus: function( ev, ui ){
            //console.log( '_onFocus '+$( ev.target ).data( 'ronin-iwm-id' )+' restoring '+this._routeGet());
            const route = this._routeGet();
            if( route ){
                FlowRouter.go( route );
            }
           return false;
        },
        // the window is minimized
        //  if all the windows are minimized, then reset the route
        _onMinimize: function( ev, ui ){
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
        },
        _onResizeStop: function( ev, ui ){
            //console.log( '_onResizeStop '+$( ev.target ).data( 'ronin-iwm-id' ));
            this._saveSettings();
        },
        // restore size and position
        _restoreSettings: function( id ){
            const storageName = this._settingsName( id );
            if( localStorage[storageName] ){
                const settings = JSON.parse( localStorage[storageName] );
                const obj = $( this.dom );
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
        },
        // returns the initial route name attached to this window
        _routeGet: function(){
            return $( this.dom ).attr( 'data-ronin-iwm-route' );
        },
        // at creation time, set the current route name as a window data attribute
        _routeSet: function(){
            const route = FlowRouter.current();
            $( this.dom ).attr( 'data-ronin-iwm-route', route.route.name );
        },
        // save size and position
        _saveSettings: function(){
            const obj = $( this.dom );
            const position = obj.window( 'option', 'position' );
            let settings = {};
            settings.width = obj.window( 'option', 'width' );
            settings.height = obj.window( 'option', 'height' );
            settings.at = position.at;
            settings.my = position.my;
            const jsonSettings = JSON.stringify( settings );
            const storageName = this._settingsName( this._idGet());
            localStorage[storageName] = jsonSettings;
            //console.log( '_saveSettings '+storageName );
            //console.log( jsonSettings );
        },
        // return the settings key when saving/restoring size and position
        _settingsName: function( id ){
            return 'spSettings-'+id;
        },
        // close() method
        //  close the current window
        close: function( argsCount ){
            if( argsCount != 1 ){
                throwError({ message: 'close() doesn\'t expect any argument, '+this.args[1]+' found' });
            } else if( this._idGetAttribute()){
                $( this.dom ).window( 'close' );
            } else {
                throwError({ message:'IWindowed: unable to close this window' });
            }
        },
        // minimizeAll() method
        //  minimize all windows
        minimizeAll: function(){
            if( argsCount != 1 ){
                throwError({ message: 'close() doesn\'t expect any argument, '+this.args[1]+' found' });
            } else {
                const taskbar = g[LYT_WINDOW].taskbar.get();
                if( taskbar ){
                    const windows = taskbar.taskbar( 'windows' );
                    for( let i=0 ; i<windows.length ; ++i ){
                        $( windows[i] ).window( 'minimize' );
                    }
                }
            }
        },
        // setRoute() method
        //  set a programmatic route
        //  this.dom: the DOM element on which we have called the 'setRoute' method
        //  (usually a tabbed page, but must at least be a child of the target window)
        //  this.args[0]: name of the called method (setRoute)
        //  this.args[1]: route name to be set
        setRoute: function( argsCount ){
            if( argsCount != 2 ){
                throwError({ message: 'setRoute() expects 1 argument, '+( argsCount-1 )+' found' });
            } else if( typeof this.args[1] !== 'string' ){
                throwError({ message: 'setRoute() expects the route name as second argument, "'+this.args[1]+'" found' });
            } else {
                const route = this.args[1];
                const list = $( this.dom ).parents( '[data-ronin-iwm-route]' );
                if( list && list[0] ){
                    $( list[0] ).attr( 'data-ronin-iwm-route', route );
                    FlowRouter.go( route );
                }
            }
        },
        // show() method
        //  show a window, re-activating it or creating a new one
        //  this.dom: the DOM element on which we are calling the 'show' method (usually the page)
        //  this.args[0]: name of the called method (show)
        //  this.args[1]: template name to be rendered if not already exists
        //  our wm-managed window's widgets hold a 'ronin-iwm-<template_name>' class
        show: function( argsCount ){
            //console.log( 'show: argsCount='+argsCount );
            if( argsCount != 2 ){
                throwError({ message: 'show() expects 1 argument, '+( argsCount-1 )+' found' });
            } else if( typeof this.args[1] !== 'string' ){
                throwError({ message: 'show() expects the template name as second argument, "'+this.args[1]+'" found' });
            } else {
                const windows = g[LYT_WINDOW].taskbar.get().taskbar('windows');
                const tmplName = this.args[1];
                const searched = this._className( tmplName );
                let found = false;
                for( var i=0 ; i<windows.length && !found ; ++i ){
                    const widget = $( windows[i] ).window('widget');
                    if( widget.hasClass( searched )){
                        found = true;
                        //console.log( searched+' already exists, reusing' );
                        this._moveToTop( $( windows[i] ));
                    }
                }
                if( !found ){
                    //console.log( searched+" didn't exist, creating" );
                    Blaze.render( Template[tmplName], document.getElementById( g[LYT_WINDOW].rootId ));
                }
            }
        },
        // showNew() method
        //  show unconditionally a new window
        showNew: function( argsCount ){
            if( argsCount != 2 ){
                throwError({ message: 'showNew() expects 1 argument, '+( argsCount-1 )+' found' });
            } else if( typeof this.args[1] !== 'string' ){
                throwError({ message: 'showNew() expects the template name as second argument, "'+this.args[1]+'" found' });
            } else {
                //console.log( 'IWindowed.showNew '+args[1] );
                const tmplName = this.args[1];
                Blaze.render( Template[tmplName], document.getElementById( g[LYT_WINDOW].rootId ));
            }
        }
    });

    $.fn[pluginName] = function(){
        let args = arguments;
        return this.each( function(){
            new Plugin( this, args );
            /*
            if ( !$.data( this, 'ronin_plugin_' + pluginName )){
                $.data( this, 'ronin_plugin_' + pluginName, new Plugin( this, args ));
            }
            */
        });
    };

    // default values, overridable by the user at global level
    $.fn[pluginName].defaults = {
        simone: {
            widgetClass:    'ronin-iwm-widget',
            icons: {
                close:      'ui-icon-close',
                minimize:   'ui-icon-minus'
            }
        }
    };
})( jQuery, window, document );
