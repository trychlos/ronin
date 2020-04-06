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
 *  - on the widget, two classes:
 *      > ronin-iwm-widget
 *          (qualifies the presence of the window manager)
 *      > ronin-iwm-<gtd_features_group> (aka setup, collect, process, review)
 *          (titlebar coloring)
 *  - on the window, one class:
 *      > ronin-iwm-window
 *          (identifies the window parent of a component)
 *  - on the window, two attributes:
 *      > data-ronin-iwm-name = <window_template_name>
 *          (identifying already created window(s) for the template)
 *          (identify saving/restoring size and position: only one per name)
 *      > data-ronin-iwm-route = last known route path.
 *          (change route on focus change)
 *           the route path is the actual identifier, and we refuse to create
 *           several windows which would share the same path (including queryParams)
 *  - on the window, one data:
 *      > <pluginName> = <plugin_object>
 *
 *  ronin-iwm-route rationale
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
// statically import simone window manager to not run in dynamic problems
//  even if this is rather useless (as unused) in any touch device
//  http://cezarykluczynski.github.io/simone/docs/
import '/imports/client/third-party/simone/simone.min.js';
import '/imports/client/third-party/simone/i18n/simone.min.custom.js';
import '/imports/client/third-party/simone/simone.min.css';

;( function( $, window, document ){
    "use strict";
    const pluginName = "IWindowed";
    const self = this;

    // The actual plugin constructor
    class myPlugin {
        constructor( element, options ){
            this.dom = element;
            this.$dom = $( this.dom );
            this.$widget = null;
            this.args = $.extend( {}, options || {} );
            this._init( options );
        }
    }

    $.extend( myPlugin.prototype, {

        buttonClasses: [
            'ui-button',
            'ui-corner-all',
            'ui-widget'
        ],
        // reset the classes of the specified button
        //  args is [ button_number, classes_string ]
        buttonPaneResetClass: function( args ){
            if( args ){
                const $button = $( this.$widget.find( '.ui-dialog-buttonset button' )[args[0]]);
                $button
                    .removeClass()
                    .addClass( this.buttonClasses.join( ' '))
                    .addClass( args[1] );
            }
            this.$widget.find( '.ui-dialog-buttonset button.inactivable' ).addClass( 'ui-state-disabled' );
        },

        // return the name of the class added to the widget
        //  (aka the parent of the div we are working with)
        _className: function( name ){
            return 'ronin-iwm-'+name;
        },

        // close the current window
        close: function(){
            //console.log( this );
            this.$dom.window( 'close' );
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
            if( !this.args.simone.group ){
                this.settings.simone.group = this.args.template;
            }
            this.settings.simone.widgetClass += ' '+this._className( this.settings.simone.group );
            //console.log( settings );
            this.$dom.window( this.settings.simone );
            this.$dom.addClass( 'ronin-iwm-window' );
            this.$widget = $( this.$dom.parents( '.ronin-iwm-widget' )[0] );
            // set some data- attributes on the window
            //  we prefer data- attributes as set by attr() method as they are available
            //  as standard jQuery selector, and visible in the web inspector
            //  contrarily data() sets the data inside of an invisible storage space
            //  see https://api.jquery.com/data/
            const name = this.args.template;
            this._idSet( name );
            this._routeSet();
            this._createSetWidget();
            this._createSetTitlebarDiv();
            this._createSetButtonsTitle();
            this._createSetButtonpaneDiv();
            this.buttonPaneResetClass();
            this._createRestoreSettings( name );
            // set event handlers
            //  passing this to the handler, getting back in event.data
            //  in the handler, this is the attached dom element
            this.$dom.on( 'windowdragstop', this, function( ev, ui ){
                ev.data._onDragStop( ev, ui );
            });
            this.$dom.on( 'windowfocus', this, function( ev, ui ){
                ev.data._onFocus( ev, ui );
            });
            this.$dom.on( 'windowmaximize', this, function( ev, ui ){
                ev.data._onMaximize( ev, ui );
            });
            this.$dom.on( 'windowminimize', this, function( ev, ui ){
                ev.data._onMinimize( ev, ui );
            });
            this.$dom.on( 'windowresizestop', this, function( ev, ui ){
                ev.data._onResizeStop( ev, ui );
            });
            this.$dom.on( 'windowrestore', this, function( ev, ui ){
                ev.data._onRestore( ev, ui );
            });
            //console.log( $( this.dom ));
        },

        // restore size and position
        //  this = plugin
        _createRestoreSettings: function( name ){
            const storageName = this._settingsName( name );
            if( localStorage[storageName] ){
                const settings = JSON.parse( localStorage[storageName] );
                //console.log( 'restoreSettings '+storageName );
                //console.log( settings );
                this._shiftMultiple( settings );
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

        // set the title of the minimize/maximize/close buttons
        //  buttons in the titlebar are numbered from right to left
        //  this = plugin
        _createSetButtonsTitle: function(){
            const close = this.$widget.find( '.ui-dialog-titlebar > .ui-button[data-button-order="0"]' );
            close.prop( 'title', 'Close' );
            this._setRestoreButtonTitle();
            const min = this.$widget.find( '.ui-dialog-titlebar > .ui-button[data-button-order="2"]' );
            min.prop( 'title', 'Minimize' );
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
            return this.$dom.attr( 'data-ronin-iwm-name' );
        },

        // setup the identifier of the window
        //  The name of the template only identifies a generic family of windows
        //  which is usually uniquely displayed, e.g. thoughtsList, setupWindow, etc.
        //  But edition windows (thoughtEdit, actionEdit, projectEdit) usually
        //  accept multiple instances, which causes that the name will not be unique
        //  in this later case.
        //  this = plugin
        _idSet: function( name ){
            this.$dom.attr( 'data-ronin-iwm-name', name );
        },

        // plugin initialization
        //  this = plugin
        _init( options ){
            if( typeof options === 'object' || !options ){
                this.settings = $.extend( true, {}, $.fn[pluginName].defaults, options, {
                    simone: {
                        appendTo:    '#'+Ronin.ui.layouts[LYT_WINDOW].rootId,
                        beforeClose:  this._onBeforeClose,
                        close:        this._onClose,
                        taskbar:      Ronin.ui.layouts[LYT_WINDOW].taskbar.get()
                    }
                });
                this._create();
            }
        },

        // public methods applied to the plugin
        _methods(){
            //console.log( '_methods' );
            //console.log( this );
            //console.log( arguments );
            if( typeof arguments[0] === 'string' ){
                switch( arguments[0] ){
                    case 'buttonPaneResetClass':
                        this.buttonPaneResetClass( Array.prototype.slice.call( arguments, 1 ));
                        break;
                    case 'close':
                        this.close( Array.prototype.slice.call( arguments, 1 ));
                        break;
                }
            }
        },

        // activate a window, first restoring it if it was minimized
        _moveToTop: function(){
            if( this.$dom.window( 'minimized' )){
                this.$dom.window( 'restore' );
            }
            this.$dom.window( 'moveToTop' );
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
            //console.log( '_onDragStop '+$( ev.target ).data( 'ronin-iwm-name' ));
            this._saveSettings();
        },

        // the window receives the focus
        //  update the current route
        //  NB: focus is triggered twice when activated from the taskbar
        _onFocus: function( ev, ui ){
            //console.log( '_onFocus '+$( ev.target ).data( 'ronin-iwm-name' )+' restoring '+this._routeGet());
            const route = this._routeGet();
            if( route ){
                FlowRouter.go( route );
            }
           return false;
        },

        // the window is maximized
        //  update the corresponding button title
        _onMaximize: function( ev, ui ){
            this._setRestoreButtonTitle();
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
                FlowRouter.go( 'rt.home' );
            }
        },

        // the window is restored
        //  update the corresponding button title
        _onRestore: function( ev, ui ){
            this._setRestoreButtonTitle();
        },

        _onResizeStop: function( ev, ui ){
            //console.log( '_onResizeStop '+$( ev.target ).data( 'ronin-iwm-name' ));
            this._saveSettings();
        },

        // returns the initial route name attached to this window
        _routeGet: function(){
            return this.$dom.attr( 'data-ronin-iwm-route' );
        },

        // at creation time, set the current route name as a window data attribute
        //  this = plugin
        _routeSet: function(){
            const route = FlowRouter.current();
            //this.$dom.attr( 'data-ronin-iwm-route', route.route.name );
            this.$dom.attr( 'data-ronin-iwm-route', route.path );
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
            //console.log( settings );
            //console.log( jsonSettings );
        },

        _setRestoreButtonTitle: function(){
            const maximized = this.$dom.window( 'maximized' );
            const max = this.$widget.find( '.ui-dialog-titlebar > .ui-button[data-button-order="1"]' );
            max.prop( 'title', maximized ? 'Restore' : 'Maximize' );
        },

        // return the settings key when saving/restoring size and position
        _settingsName: function( name ){
            return 'spSettings-'+name;
        },

        // shift the window if there are several windows with this same template
        //  "settings.at": "left+414 top+119"
        _shiftMultiple( settings ){
            const plugins = $.fn[pluginName].pluginsByName( this.args.template );
            //console.log( this.args.template+' IWindowed.length='+plugins.length );
            if( plugins.length ){
                const regex = /^([a-z]+)\+(\d+) ([a-z]+)\+(\d+)$/;
                const matches = regex.exec( settings.at );
                //console.log( matches );
                const shift2 = parseInt( matches[2] )+parseInt( this.settings.ronin.shift );
                const shift4 = parseInt( matches[4] )+parseInt( this.settings.ronin.shift );
                settings.at = matches[1]+'+'+shift2+' '+matches[3]+'+'+shift4;
                //console.log( 'shifting '+this.args.template+' to '+settings.at );
            }
        }
    });

    $.fn[pluginName] = function(){
        //console.log( this );  // this is the jQuery element on which the interface is called
        //console.log( arguments );
        const opts = Array.prototype.slice.call( arguments );
        this.each( function(){
            //console.log( this ); // this is the particular DOM element on which the interface will be applied
            // may or may not already been initialized
            let plugin = $.data( this, pluginName );
            //console.log( plugin );
            if( plugin ){
                //console.log( 'reusing already initialized plugin' );
                myPlugin.prototype._methods.apply( plugin, opts );
            } else {
                //console.log( 'allocating new plugin instance' );
                $.data( this, pluginName, new myPlugin( this, opts[0] ));
            }
        });
        return this;
    };

    // default values, overridable by the user at global level
    $.fn[pluginName].defaults = {
        ronin: {
            shift: 40
        },
        simone: {
            icons: {
                close:      'ui-icon-close',
                minimize:   'ui-icon-minus'
            },
            widgetClass:    'ronin-iwm-widget'
        }
    };

    // minimizeAll() public method
    //  minimize all windows
    $.fn[pluginName].minimizeAll = () => {
        const taskbar = Ronin.ui.layouts[LYT_WINDOW].taskbar.get();
        if( taskbar ){
            const windows = taskbar.taskbar( 'windows' );
            for( let i=0 ; i<windows.length ; ++i ){
                $( windows[i] ).window( 'minimize' );
            }
        }
    },

    // pageClose() public method
    //  in windowLayout mode, close the current window
    //  in pageLayout mode, change the route
    //  Args:
    //  - none
    $.fn[pluginName].pageClose = ( $window ) => {
        switch( Ronin.ui.runLayout()){
            case LYT_PAGE:
                if( history.length > 1 ){
                    history.back();
                } else {
                    FlowRouter.go( Ronin.ui.defaults.pageItem );
                }
                break;
            case LYT_WINDOW:
                $window.IWindowed( 'close' );
                break;
        }
    };

    // pluginsByName() public method
    //  Returns the list of initialized plugins associated with the specified template.
    $.fn[pluginName].pluginsByName = ( template ) => {
        const windows = Ronin.ui.layouts[LYT_WINDOW].taskbar.get().taskbar( 'windows' );
        let plugins = [];
        for( let i=0 ; i<windows.length ; ++i ){
            const name = $( windows[i] ).attr( 'data-ronin-iwm-name' );
            if( name === template ){
                const p = $( windows[i] ).data( pluginName );
                if( p ){
                    plugins.push( p );
                }
            }
        }
        return( plugins );
    };

    // pluginByPath() public method
    //  Returns the plugin instance which manages the window which exhibits the
    //  route path, or null
    //  Even if the template accepts multiple instances, the path, including
    //  queryParams, is the actual identifier of the window instance, and must
    //  be kept unique in the interface
    $.fn[pluginName].pluginByPath = ( path ) => {
        //console.log( 'searching for '+path );
        const taskbar = Ronin.ui.layouts[LYT_WINDOW].taskbar.get();
        if( taskbar ){
            const windows = taskbar.taskbar( 'windows' );
            for( let i=0 ; i<windows.length ; ++i ){
                const route = $( windows[i] ).attr( 'data-ronin-iwm-route' );
                if( route === path ){
                    return( $( windows[i] ).data( pluginName ));
                }
            }
        }
        return( null );
    },

    // setRoute() public method
    //  inside of a window, set an internal route as the 'data-ronin-iwm-route'
    //  attribute for this window
    //  Args:
    //  - route name
    $.fn[pluginName].setRoute = ( selector, route ) => {
        //console.log( this ); // undefined
        //console.log( myPlugin );
        if( !route || typeof route !== 'string' ){
            console.log( 'setRoute() expects the route name as single argument, "'+route+'" found' );
        } else {
            //console.log( 'setRoute '+route );
            const list = $( selector ).parents( '.ronin-iwm-window' );
            if( list && list.length ){
                $( list[0] ).attr( 'data-ronin-iwm-route', route );
            }
            FlowRouter.go( route );
        }
    };

    // show() public method
    //  show a window, re-activating it or creating a new one
    //  this method is to be called on the 'parent' of the to-be-created window
    //  as a consequence, the plugin is not activated here, but will be on the actual
    //  window creation
    //  Args:
    //  - template name
    $.fn[pluginName].show = ( template, data ) => {
        //console.log( this );
        //console.log( myPlugin );
        //console.log( data );
        if( !template || typeof template !== 'string' ){
            console.log( 'show() expects the template name as single argument, "'+template+'" found' );
        } else {
            let plugin = null;
            if( data.multiple ){
                const route = FlowRouter.current();
                plugin = $.fn[pluginName].pluginByPath( route.path );
            } else {
                const plugins = $.fn[pluginName].pluginsByName( template );
                plugin = plugins ? plugins[0] : null;
            }
            if( plugin ){
                plugin._moveToTop();
            } else {
                Blaze.renderWithData( Template[template], data, document.getElementById( Ronin.ui.layouts[LYT_WINDOW].rootId ));
            }
        }
    };

    // showNew() public method
    //  show unconditionally a new window, passing it the provided context
    $.fn[pluginName].showNew = ( template, data ) => {
        Blaze.renderWithData( Template[template], data, document.getElementById( Ronin.ui.layouts[LYT_WINDOW].rootId ));
    };

}( jQuery, window, document ));

/*
                    case 'buttonLabel':
                        this.buttonLabel( Array.prototype.slice.call( arguments, 1 ));
                        break;

        // buttonLabel() method
        //  set the label of the specified button in the bottom buttonpane
        //  - index from zero
        //  - label
        buttonLabel: function( args ){
            const index = args[0];
            const label = args[1];
            //console.log( 'buttonLabel index='+index+' label='+label );
            const buttons = this.$widget.find( '.ui-dialog-buttonset button' );
            if( buttons ){
                $( buttons[index] ).html( label );
            } else {
                console.log( 'buttonLabel: unable to find buttonPane' );
            }
        },

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
            if( typeof this.args[0] === 'string' ){
                switch( this.args[0] ){
                    case 'addButton':
                        this.addButton( argsCount );
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
                        messageError({ message:'IWindowed: unknown method: '+this.args[0] });
                }
                return;
            }
            if( argsCount != 1 || typeof this.args[0] !== 'object' ){
                messageError({ message:'IWindowed: options object expected, not found' });
                return;
            }
            this._create();
        },
        // addButton() method
        //  must be applied on the window
        //  adds a button on the right of the titlebar
        //  expected args:
        //  - selector to be installed
        addButton: function( argsCount ){
            if( argsCount != 2 ){
                messageError({ message: 'addButton() expects two arguments, '+( argsCount-1 )+' found' });
            } else if( !$( this.dom ).hasClass( 'ronin-iwm-window' )){
                messageError({ message: 'addButton() must be invoked on the IWindowed element' });
            } else {
                const selector = this.args[1];
                const widget = $( this.dom ).parents( '.ronin-iwm-widget' )[0];
                const titlebar = $( widget ).find( '.ronin-iwm-titlebar' );
                const content = $( this.dom ).find( selector ).detach();
                $( titlebar ).append( content );
            }
        },
    });
*/