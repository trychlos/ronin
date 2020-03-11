/*
 * 'ITabbed' pseudo-interface.
 *  To be used by every tabbed window.
 *
 *  Modules story:
 *  1. first choice was jQuery Tabs
 *      https://api.jqueryui.com/tabs/
 *      Cancelled as non scrollable.
 *  2. second choice has been jqxTabs
 *      Cancelled as only scrollable with non-resizable arrows
 *      https://www.jqwidgets.com/jquery-widgets-documentation/documentation/jqxtabs/jquery-tabs-getting-started.htm
 *  3. current choice is scrolling tab
 *      both scrollable and swypeable
 *      https://www.jqueryscript.net/other/jQuery-Plugin-To-Create-Responsive-Scrolling-Bootstrap-Tabs.html
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
 *  Boilerplate from https://github.com/jquery-boilerplate/jquery-boilerplate/blob/master/src/jquery.boilerplate.js
 */
import '/imports/client/third-party/scrollingTabs/dist/jquery.scrolling-tabs.min.css';
import '/imports/client/third-party/scrollingTabs/dist/jquery.scrolling-tabs.min.js';
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
            const self = this;
            let settings = $.extend( true, {}, this.args, $.fn[pluginName].defaults );
            // set a 'ronin-itabbed' class on the root element
            this.$dom.addClass( 'ronin-itabbed' );
            $( this.$dom.find( '.nav-tabs' )[0] ).scrollingTabs( settings.jquery );
            // if defined, make sure the requested tab is activated
            if( this.args.tab ){
                this._activate( this.args.tab );
            }
        },
        // activating a tab means
        //  - desactivating the previous tab
        //  - activating and showing the designated tab
        _activate: function( name ){
            this.$dom.find( '.nav-tabs>ul>li.nav-item>a.nav-link' ).removeClass( 'active' );
            const $tab = this._byName( name );
            $tab.find( 'a.nav-link' ).addClass( 'active' );
            this.$dom.find( '#'+name ).addClass( 'active show' );
        },
        // return the jQuery tab at the specified index
        _byIndex: function( idx ){
            return $( this.$dom.find('li.nav-item[role=presentation]')[idx] );
        },
        // return the named tab
        _byName: function( name ){
            return this._byIndex( this._index( name ) );
        },
        // select the named tab
        _go: function( name ){
            const $tab = this._byName( name );
            const route = $tab.attr( 'data-ronin-itb-route' );
            $().IWindowed.setRoute( '.ronin-itabbed', route );
        },
        // return the index of the named tab
        //  defaulting to the first tab
        _index: function( name ){
            const tabs = this._tabs();
            return tabs[name];
        },
        // re-calling an already initialized plugin
        _methods: function(){
            //console.log( opts );
            //console.log( arguments );
            if( typeof opts === 'object' ){
                if( opts.tab ){
                    this.$dom.jqxTabs( 'select', this._index( opts.tab ));
                }
            // programatically activating and showing a tab
            } else if( arguments[0] === 'activate' ){
                this._activate( arguments[1] );
            // update the route after a user selection
            } else if( arguments[0] === 'go' ){
                this._go( arguments[1] );
            }
        },
        // return a hash tabid -> tabidx (marked as 'data-itabbed')
        //  NB: only works after full initialization
        _tabs: function( element ){
            //console.log( 'classes='+element.attr('class'));
            let o = {}
            let idx = 0;
            this.$dom.find( 'li.nav-item[role=presentation]' ).each( function(){
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
                //console.log( opts );
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
            scrollToTabEdge: true,
            enableSwiping: true,
            disableArrowsOnFullyScrolled: false,
            bootstrapVersion: 4,
            tabClickHandler: function( ev ){
                let $li = $( this );
                if( this.nodeName === 'A' ){
                    $li = $( this ).parent( 'li' );
                }
                const name = $li.attr( 'data-itabbed' );
                //console.log( 'switching to '+name );
                const tabbed = $li.parents( '.ronin-itabbed' )[0];
                if( tabbed ){
                    $( tabbed ).ITabbed( 'go', name );
                }
            },
            cssClassLeftArrow: 'fas fa-chevron-left',
            cssClassRightArrow: 'fas fa-chevron-right'
        }
    };
})( jQuery, window, document );
