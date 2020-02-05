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
 *      > ronin-iwm
 *      > ronin-iwm-<gtd_features_group>
 *      > ronin-iwm-<window_template_name>
 *  - on the window, two data attributes:
 *      > ronin-iwm-id = <window_template_name>
 *      > ronin-iwm-route = last known route name.
 *
 *  Properties:
 *  - template: mandatory, the template name
 *      this is the default identifier
 *  + all simone options
 *
 *  From https://github.com/jquery-boilerplate/jquery-boilerplate/blob/master/src/jquery.boilerplate.js
 */
import { gtd } from '/imports/assets/gtd/gtd.js';
import '/imports/client/interfaces/itabbed/itabbed.js'

;( function( $, window, document ){
    "use strict";
    const pluginName = "IWindowed",
        defaults = {
            propertyName: "value"
        };

		// The actual plugin constructor
    function Plugin( element, options ){
        this.dom = element;
        this.args = options;
        /*
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        */
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend( Plugin.prototype, {
        init: function(){
            // this = {
            //      dom         DOM calleed element (not jQuery)
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
                    case 'show':
                        this.show( argsCount );
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
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.settings
            // you can add more functions like the one below and
            // call them like the example below
            //this.yourOtherFunction( "jQuery Boilerplate" );
        },
        _beforeCloseEH: function( ev ){
            //_saveSettings( $( ev.target ), _idGet( $( ev.target )));
        },
        // return the name of the class added to the widget
        //  (aka the parent of the div we are working with)
        //  to be kept close of $.fn.IWindowed.defaults.widgetClass
        _className: function( id ){
            return 'ronin-iwm-'+id;
        },
        // the widget which encapsulates the window has been closed
        //  but the div itself is still in the DOM
        // $(ev.target) === ui.$window === jQuery object on which we have called window()
        _closeEH: function( ev, ui ){
            console.log( 'close event handler' );
            $( ev.target ).remove();
        },
        // we have asked to show a new window: create it
        _create: function(){
            const args = this.args[0];
            if( !args.template ){
                throwError({ message:'IWindowed: template name not set' });
                return;
            }
            //  we set on the window's widget a 'ronin-iwm-<template_name>' class
            //  plus maybe a 'ronin-iwm-<group>' one if different of the template name
            let settings = $.extend( true, {}, args, $.fn[pluginName].defaults, {
                simone: {
                    appendTo:     '#'+g[LYT_WINDOW].rootId,
                    beforeClose:  this._beforeCloseEH,
                    close:        this._closeEH,
                    taskbar:       g[LYT_WINDOW].taskbar.get()
                }
            });
            settings.simone.widgetClass += ' '+this._className( args.template );
            if( !args.simone.group ){
                settings.simone.group = args.template;
            } else {
                settings.simone.widgetClass += ' '+this._className( args.simone.group );
            }
            console.log( settings );
            $( this.dom ).window( settings.simone );
            this._idSet();
            //this._routeSet();
            this._restoreSettings();
        },
        // returns the identifier of this window
        _id: function(){
            return this.args.template
        },
        // returns the identifier set as a data attribute of the window
        _idGet: function(){
            return $( this.dom ).data( 'ronin-iwm-id' );
        },
        // setup the identifier of the window
        _idSet: function(){
            $( this.dom ).data( 'ronin-iwm-id', this._id());
        },
        // activate a window, first restoring it if it was minimized
        _moveToTop: function( obj ){
            if( obj.window('minimized')){
                obj.window('restore');
            }
            obj.window('moveToTop');
        },
        // restore size and position
        _restoreSettings: function(){
            const storageName = this._settingsName();
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
        // return the settings key when saving/restoring size and position
        _settingsName: function(){
            return 'spSettings-'+this._id();
        },
        // show a window, re-activating it or creating a new one
        // this.dom: the DOM element on which we are calling the 'show' method (usually the page)
        // this.args[0]: name of the called method (show)
        // this.args[1]: template name to be rendered if not already exists
        //  our wm-managed window's widgets hold a 'ronin-iwm-<template_name>' class
        show: function( argsCount ){
            //console.log( 'show: argsCount='+argsCount );
            if( argsCount != 2 ){
                throwError({ message: 'show expects 1 argument, '+( argsCount-1 )+' found' });
            } else if( typeof this.args[1] !== 'string' ){
                throwError({ message: 'show expects the template name as second argument, "'+this.args[1]+'" found' });
            } else {
                const windows = g[LYT_WINDOW].taskbar.get().taskbar('windows');
                const tmplName = this.args[1];
                const searched = this._className( tmplName );
                let found = false;
                for( var i=0 ; i<windows.length && !found ; ++i ){
                    const widget = $( windows[i] ).window('widget');
                    if( widget.hasClass( searched )){
                        found = true;
                        console.log( searched+' already exists, reusing' );
                        this._moveToTop( $( windows[i] ));
                    }
                }
                if( !found ){
                    console.log( searched+" didn't exist, creating" );
                    Blaze.render( Template[tmplName], document.getElementById( g[LYT_WINDOW].rootId ));
                }
            }
        }
    });

    $.fn[pluginName] = function(){
        let args = arguments;
        return this.each( function(){
            const instance = new Plugin( this, args );
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
            widgetClass:    'ronin-iwm',
            icons: {
                close:      'ui-icon-close',
                minimize:   'ui-icon-minus'
            }
        }
    };
})( jQuery, window, document );

    // default values, overridable by the user at global level
    /*
    $.fn.IWindowed.defaults = {
        widgetClass:    'ronin-iwm',
        icons: {
            close:      'ui-icon-close',
            minimize:   'ui-icon-minus'
        }
    };
    $.fn.IWindowed = function(){
        this.each( function(){


            return function(){
                const $this = $( this );
                console.log( arguments );
                if( typeof arguments[0] === 'string' ){
                    switch( arguments[0] ){
                        case 'show':
                            _show( this, arguments );
                            break;
                        default:
                            throwError({ message:'IWindowed: unknown method: '+arguments[0] });
                    }
                    return this;
                }
            }
        });
    }
})( jQuery );
*/
