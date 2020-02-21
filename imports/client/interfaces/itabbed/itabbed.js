/*
 * 'ITabbed' pseudo-interface.
 *  To be used by every tabbed window.
 *
 *  We have chosen to use jQuery Tabs.
 *  jQuery Tabs relies on a specific HTML markup
 *  see API documentation https://api.jqueryui.com/tabs/.
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
            //console.log( this );
            let settings = $.extend( true, {}, this.args, $.fn[pluginName].defaults );
            // set a 'ronin-itabbed' class on the root element
            this.$dom.addClass( 'ronin-itabbed' );
            //console.log( settings );
            this.$dom.tabs( settings.jquery );
            // if defined, make sure the requested tab is activated
            if( this.args.tab ){
                this.$dom.tabs({ active: this._index( this.args.tab )});
            }
            // set event handlers
            //  passing this to the handler, getting back in event.data
            //  in the handler, this is the attached dom element
            $( this.dom ).on( 'tabsactivate', this, function( ev, ui ){
                const route = $( ui.newTab ).attr( 'data-ronin-itb-route' );
                $( ui.newTab ).IWindowed.setRoute( route );
            });
            //console.log( $( this.dom ));
        },
        // return the index of the named tab
        //  defaulting to the first tab
        _index: function( name ){
            const tabs = this._tabs();
            for( let i=0 ; i<tabs.length ; ++i ){
                if( name === tabs[i] ){
                    return i;
                }
            }
            return 0;
        },
        // return the array of tab identifiers (marked as 'data-itabbed')
        //  NB: only works after first initialization
        _tabs: function( element ){
            //console.log( 'classes='+element.attr('class'));
            let tabs = new Array();
            let idx = 0;
            $( this.dom ).find('li[role=tab]').each( function(){
                const id = $( this ).attr('data-itabbed');
                tabs.push( id ? id : idx );
                idx += 1;
            });
            return tabs;
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
        jquery: {
        }
    };
})( jQuery, window, document );
