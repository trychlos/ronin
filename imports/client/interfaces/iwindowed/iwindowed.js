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
    const self = this;

    // The actual plugin constructor
    class myPlugin {
        constructor( element, options ){
            this.dom = element;
            this.$dom = $( this.dom );
            this.args = $.extend( {}, options || {} );
            this._init( options );
        }
    }

    $.extend( myPlugin.prototype, {

        // return the name of the class added to the widget
        //  (aka the parent of the div we are working with)
        //  to be kept close of $.fn.IWindowed.defaults.widgetClass
        //  no this here (static call from show() public method)
        _className: function( id ){
            return 'ronin-iwm-'+id;
        },

        // creating a new window
        //  this = plugin
        _create: function(){
            //console.log( this );
            if( !this.args.template ){
                console.log( 'IWindowed: template name not set' );
                return;
            }
            // we set on the window's widget a 'ronin-iwm-<template_name>' class
            //  plus maybe a 'ronin-iwm-<group>' one if specified and different
            //  of the template name
            this.settings.simone.widgetClass += ' '+this._className( this.args.template );
            if( this.args.simone.group ){
                if( this.settings.simone.group !== this.args.template ){
                    this.settings.simone.widgetClass += ' '+this._className( this.args.simone.group );
                }
            } else {
                this.settings.simone.group = this.args.template;
            }
            //console.log( settings );
            this.$dom.window( this.settings.simone );
            this.$dom.addClass( 'ronin-iwm-window' );
            // set some data- attributes on the window
            //  we prefer data- attributes as set by attr() method as they are available
            //  as standard jQuery selector, and visible in the console log
            //  contrarily data() set the data inside of an invisible storage space
            const id = this.args.template;
            this._idSet( id );
            this._routeSet();
            this._createSetWidget();
            this._createSetTitlebarDiv();
            this._createSetButtonpaneDiv();
            this._createRestoreSettings( id );
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

        // restore size and position
        //  this = plugin
        _createRestoreSettings: function( id ){
            const storageName = this._settingsName( id );
            if( localStorage[storageName] ){
                const settings = JSON.parse( localStorage[storageName] );
                this.$dom.window( 'option', 'position', {
                    my: settings.my,
                    at: settings.at,
                    of: window,
                    collision: 'fit'
                });
                this.$dom.window( 'option', 'width', settings.width );
                this.$dom.window( 'option', 'height', settings.height );
                this.$dom.window( 'refreshPosition' );
            }
        },

        // add a div around the first button of the button pane
        //  this let us have this first button pushed on the left, others being on the right
        //  this = plugin
        _createSetButtonpaneDiv: function(){
            this.$widget.find( '.ui-dialog-buttonset button' ).wrap( '<div></div>');
        },

        // add a flexbox div inside of the titlebar
        //  this let the application put buttons later inside of this div
        //  + append inside of this titlebar all 'ronin-iwm-titlebadge' children
        //  this = plugin
        _createSetTitlebarDiv: function(){
            const span = this.$widget.find( '.ui-dialog-titlebar.ui-widget-header span.ui-dialog-title' );
            $( span ).after( '<div class="ronin-iwm-titlebar"></div>' );
            const bar = this.$widget.find( '.ronin-iwm-titlebar' )[0];
            this.$dom.find( '.ronin-iwm-titlebadge' ).each( function( index, elt ){
                $( elt ).detach();
                $( bar ).append( elt );
            });
        },

        // return the widget, parent of 'this' window
        //  this can be called only after window creation
        //  this = plugin
        _createSetWidget: function(){
            if( !this.$widget ){
                this.$widget = $( this.$dom.parents( '.ronin-iwm-widget' )[0] );
            }
            return this.$widget;
        },

        // returns the identifier set as a data attribute of the window
        //  this = plugin
        _idGet: function(){
            return $( this.dom ).attr( 'data-ronin-iwm-id' );
        },

        // setup the identifier of the window
        //  this = plugin
        _idSet: function( id ){
            $( this.dom ).attr( 'data-ronin-iwm-id', id );
        },

        // plugin initialization
        //  this = plugin
        _init( options ){
            if( typeof options === 'object' || !options ){
                this.settings = $.extend( true, {}, $.fn[pluginName].defaults, options, {
                    simone: {
                        appendTo:    '#'+g[LYT_WINDOW].rootId,
                        beforeClose:  this._onBeforeClose,
                        close:        this._onClose,
                        taskbar:      g[LYT_WINDOW].taskbar.get()
                    }
                });
                this._create();
            }
            if( typeof arguments[0] === 'string' ){
                switch( arguments[0] ){
                }
            }
        },

        // event handler triggered from inside Simone window manager
        //  this = the IWindowed DOM element
        _onBeforeClose: function( ev, ui ){
            const plugin = $( this ).data( pluginName );
            plugin._saveSettings();
        },

        // event handler triggered from inside Simone window manager
        //  this = the IWindowed DOM element
        // the widget which encapsulates the window has been closed
        //  but the div itself is still in the DOM
        // $(ev.target) === ui.$window === jQuery object on which we have called window()
        _onClose: function( ev, ui ){
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

        // at creation time, set the current route name as a window data attribute
        //  this = plugin
        _routeSet: function(){
            const route = FlowRouter.current();
            $( this.dom ).attr( 'data-ronin-iwm-route', route.route.name );
        },

        // save size and position
        _saveSettings: function(){
            const position = this.$dom.window( 'option', 'position' );
            let settings = {};
            settings.width = this.$dom.window( 'option', 'width' );
            settings.height = this.$dom.window( 'option', 'height' );
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
    });

    $.fn[pluginName] = function( o ){
        //console.log( this );  // this is the jQuery element on which the interface is called
        const opts = o;
        this.each( function(){
            //console.log( this ); // this is the particular DOM element on which the interface will be applied
            // may or may not already been initialized
            let plugin = $.data( this, pluginName );
            //console.log( plugin );
            if( plugin ){
                console.log( 'reusing already initialized plugin' );
                plugin.apply( this, opts );
            } else {
                console.log( 'allocating new plugin instance' );
                $.data( this, pluginName, new myPlugin( this, opts ));
            }
        });
        return this;
    };

    // default values, overridable by the user at global level
    $.fn[pluginName].defaults = {
        simone: {
            icons: {
                close:      'ui-icon-close',
                minimize:   'ui-icon-minus'
            },
            widgetClass:    'ronin-iwm-widget'
        }
    };

    // show() public method
    //  show a window, re-activating it or creating a new one
    //  this method is to be called on the 'parent' of the to-be-created window
    //  as a consequence, the plugin is not activated here, but will be on the actual
    //  window creation
    //  Args:
    //  - template name
    $.fn[pluginName].show = function( template ){
        //console.log( this );
        //console.log( myPlugin );
        if( !template || typeof template !== 'string' ){
            console.log( 'show() expects the template name as single argument, "'+template+'" found' );
        } else {
            const windows = g[LYT_WINDOW].taskbar.get().taskbar('windows');
            const searched = myPlugin.prototype._className( template );
            let found = false;
            for( var i=0 ; i<windows.length && !found ; ++i ){
                const widget = $( windows[i] ).window( 'widget' );
                if( widget.hasClass( searched )){
                    found = true;
                    this._moveToTop( $( windows[i] ));
                }
            }
            if( !found ){
                Blaze.render( Template[template], document.getElementById( g[LYT_WINDOW].rootId ));
            }
        }
    };
}( jQuery, window, document ));

/*
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
            // if no argument, nothing to do, just return
            if( !argsCount ){
                return;
            }
            if( typeof this.args[0] === 'string' ){
                switch( this.args[0] ){
                    case 'addButton':
                        this.addButton( argsCount );
                        break;
                    case 'buttonLabel':
                        this.buttonLabel( argsCount );
                        break;
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
        // activate a window, first restoring it if it was minimized
        _moveToTop: function( obj ){
            if( obj.window('minimized')){
                obj.window('restore');
            }
            obj.window('moveToTop');
        },
        // returns the initial route name attached to this window
        _routeGet: function(){
            return $( this.dom ).attr( 'data-ronin-iwm-route' );
        },
        // addButton() method
        //  must be applied on the window
        //  adds a button on the right of the titlebar
        //  expected args:
        //  - selector to be installed
        addButton: function( argsCount ){
            if( argsCount != 2 ){
                throwError({ message: 'addButton() expects two arguments, '+( argsCount-1 )+' found' });
            } else if( !$( this.dom ).hasClass( 'ronin-iwm-window' )){
                throwError({ message: 'addButton() must be invoked on the IWindowed element' });
            } else {
                const selector = this.args[1];
                const widget = $( this.dom ).parents( '.ronin-iwm-widget' )[0];
                const titlebar = $( widget ).find( '.ronin-iwm-titlebar' );
                const content = $( this.dom ).find( selector ).detach();
                $( titlebar ).append( content );
            }
        },
        // buttonLabel() method
        //  set the label of the specified button in the bottom buttonpane
        //  - index from zero
        //  - label
        buttonLabel: function( argsCount ){
            if( argsCount != 3 ){
                throwError({ message: 'buttonLabel() expects three arguments, '+( argsCount-1 )+' found' });
            } else if( !$( this.dom ).hasClass( 'ronin-iwm-window' )){
                throwError({ message: 'buttonLabel() must be invoked on the IWindowed element' });
            } else {
                const widget = this._widget( this.dom );
                const buttons = $( widget ).find( '.ui-dialog-buttonset button' );
                const index = this.args[1];
                const label = this.args[2];
                $( buttons[index] ).html( label );
            }
        },
        // close() method
        //  close the current window
        close: function( argsCount ){
            if( argsCount != 1 ){
                throwError({ message: 'close() doesn\'t expect any argument, '+this.args[1]+' found' });
            } else if( this._idGet()){
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

            new Plugin( this, args );

            //}
        });
    };
*/