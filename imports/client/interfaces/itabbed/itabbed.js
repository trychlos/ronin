/*
 * 'ITabbed' pseudo-interface.
 *  To be used by every tabbed window.
 *
 *  Modules story:
 *  1. first choice was jQuery Tabs
 *      https://api.jqueryui.com/tabs/
 *      Cancelled as non scrollable.
 *  2. Current choice is jqxTabs
 *      https://www.jqwidgets.com/jquery-widgets-documentation/documentation/jqxtabs/jquery-tabs-getting-started.htm
 *
 *  A ITabbed-able page should be built as:
 *  1. a <ul></ul> index section
 *      where each <li> item must hold
 *      > a 'data-itabbed' attribute which holds the item identifier
 *      > a 'data-ronin-itb-route' attribute which holds the corresponding route name
 *  2. the content of each item.
 *
 *  The ITabbed interface adds a 'ronin-itabbed' class to the callee element.
 *
 *  Properties:
 *  - tab (optional) tab identifier
 *  + all jQuery Tabs options.
 *
 *  From https://github.com/jquery-boilerplate/jquery-boilerplate/blob/master/src/jquery.boilerplate.js
 */
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import '/imports/client/third-party/jqwidgets/jqxtabs.js';

;( function( $, window, document ){
    "use strict";
    const pluginName = "ITabbed";

    // The actual plugin constructor
    function myPlugin( element, options ){
        this.dom = element;
        this.$dom = $( this.dom );
        this.$widget = null;
        this.args = $.extend( {}, options || {} );
        this._init( options );
    }

    // Avoid MyPlugin.prototype conflicts
    $.extend( myPlugin.prototype, {
        _init: function(){
            //console.log( this );
            // this = {
            //      dom         DOM callee element (not jQuery)
            //      args = {
            //          0: 'show',
            //          1: 'thoughtEdit'
            //      }
            //  }
            if( typeof this.args === 'object' ){
                this._create();
            }
        },
        // we have asked to show a new tabbed panel: create it
        _create: function(){
            const self = this;
            let settings = $.extend( true, {}, this.args, $.fn[pluginName].defaults );
            // set a 'ronin-itabbed' class on the root element
            this.$dom.addClass( 'ronin-itabbed' );
            //console.log( settings );
            this.$dom.jqxTabs( settings.jqxTabs );
            // if defined, make sure the requested tab is activated
            if( this.args.tab ){
                this.$dom.jqxTabs( 'select', this._index( this.args.tab ));
            }
            // set event handlers
            //  passing this to the handler, getting back in event.data
            //  in the handler, this is the attached dom element
            this.$dom.on( 'selected', function( ev ){
                const tab = self._byIndex( ev.args.item );
                const route = $( tab ).attr( 'data-ronin-itb-route' );
                $().IWindowed.setRoute( '.ronin-itabbed', route );
            });
        },
        // return the tab at the specified index
        _byIndex: function( idx ){
            return this.$dom.find('li[role=tab]')[idx];
        },
        // return the index of the named tab
        //  defaulting to the first tab
        _index: function( name ){
            const tabs = this._tabs();
            return tabs[name];
        },
        // re-calling an already initialized plugin
        _methods: function( opts ){
            //console.log( opts );
            if( typeof opts === 'object' ){
                if( opts.tab ){
                    this.$dom.jqxTabs( 'select', this._index( opts.tab ));
                }
            }
        },
        // return a hash tabid -> tabidx (marked as 'data-itabbed')
        //  NB: only works after first initialization
        _tabs: function( element ){
            //console.log( 'classes='+element.attr('class'));
            let o = {}
            let idx = 0;
            this.$dom.find( 'li[role=tab]' ).each( function(){
                const id = $( this ).attr('data-itabbed');
                o[id] = idx;
                idx += 1;
            });
            return o;
        }
    });

    $.fn[pluginName] = function(){
        //console.log( this );  // this is the jQuery element on which the interface is called
        const opts = Array.prototype.slice.call( arguments );
        //console.log( opts );
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
        jqxTabs: {
        }
    };
})( jQuery, window, document );
