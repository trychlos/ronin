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
                throwError({ message: 'ITabbed interface requires at least one argument' });
                return;
            }
            if( typeof this.args[0] === 'string' ){
                switch( this.args[0] ){
                    /*
                    case 'close':
                        this.close( argsCount );
                        break;
                        */
                    default:
                        throwError({ message:'ITabbed: unknown method: '+this.args[0] });
                }
                return;
            }
            if( argsCount != 1 || typeof this.args[0] !== 'object' ){
                throwError({ message:'ITabbed: options object expected, not found' });
                return;
            }
            this._create();
        },
        // we have asked to show a new tabbed panel: create it
        _create: function(){
            //console.log( this );
            const args = this.args[0];
            // we set on the widget a 'ronin-itabbed' class
            let settings = $.extend( true, {}, args, $.fn[pluginName].defaults );
            // set a 'ronin-itabbed' class on the root element
            $( this.dom ).addClass( 'ronin-itabbed' );
            //console.log( 'jqxTabs settings='+JSON.stringify( settings ));
            $( this.dom ).tabs( settings.jquery );
            // if defined, make sure the requested tab is activated
            if( args.tab ){
                $( this.dom ).tabs({ active: this._index( args.tab )});
            }
            // set event handlers
            //  passing this to the handler, getting back in event.data
            //  in the handler, this is the attached dom element
            $( this.dom ).on( 'tabsactivate', this, function( ev, ui ){
                const route = $( ui.newTab ).attr( 'data-ronin-itb-route' );
                $( ui.newTab ).IWindowed( 'setRoute', route );
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
        jquery: {
        }
    };
})( jQuery, window, document );
