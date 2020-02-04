/*
 * 'ITabbed' pseudo-interface.
 *  To be used by every tabbed window.
 *
 *  We have chosen to use jQuery Tabs.
 *  jQuery Tabs relies on a specific HTML markup
 *  see API documentation https://api.jqueryui.com/tabs/.
 *
 *  More, ITabbed expects that each <li> holds a 'data-itabbed'
 *  attribute, with the tab identifier as a value.
 *
 *  Properties:
 *  - tab (optional) tab identifier
 *  + all jQuery Tabs options.
 */
import { gtd } from '/imports/assets/gtd/gtd.js';

( function( $ ){
    $.fn.ITabbed = function(){
        if( !this.length ){
            //throwError({ message: "no 'this' context here" });
            return;
        }
        const self = this;
        // are we calling a method on this interface ?
        if( arguments.length > 0 && typeof arguments[0] === 'string' ){
            const action = arguments[0];
            /* deal with action */
            return this;
        }
        const opts = arguments.length > 0 ? Object.assign({},arguments[0]) : {};
        // split between specific and Tabs properties
        //  Rationale: jqWidgets library refuse to work with extra props; jQuery not tested against
        const specifics = [
            'tab'
        ];
        let specs = {};
        const keys = Object.keys( opts );
        keys.forEach( key => {
            if( specifics.includes( key )){
                specs[key] = opts[key];
                delete opts[key];
            }
        });
        // set a 'pwi-itabbed' class on the root element
        //  if this class is already there, so this is not the first initialization
        //  else setup default values
        let settings = {};
        if( self.hasClass( 'pwi-itabbed' )){
            settings = Object.assign( {}, opts );
        } else {
            settings = Object.assign( {}, $.fn.ITabbed.defaults );
            $.extend( settings, opts );
            self.addClass( 'pwi-itabbed' );
        }
        //console.log( 'jqxTabs settings='+JSON.stringify( settings ));
        self.tabs( settings );
        // make sure the requested tab is activated
        if( specs.tab ){
            const idx = _index( self, specs.tab );
            self.tabs({ active: idx });
        }
        // events tracker
        self.on( 'tabsactivate', function( event, ui ){
            const route = $( ui.newTab ).data( 'pwi-iroutable-route' );
            const window = $( ui.newTab ).parents( [data-ronin-iwm-route] )[0];
            console.log( window );
            if( route ){
                FlowRouter.go( route );
            }
        });
        return this;
    };
    // default values, overridable by the user at global level
    $.fn.ITabbed.defaults = {
    };
    // return the index of the named tab
    function _index( element, name ){
        const tabs = _tabs( element );
        for( var i=0 ; i<tabs.length ; ++i ){
            if( name === tabs[i] ){
                return i;
            }
        }
        return 0;
    };
    // return the array of tab identifiers (marked as 'data-itabbed')
    //  NB: only works after first initialization
    function _tabs( element ){
        //console.log( 'classes='+element.attr('class'));
        let tabs = new Array();
        let idx = 0;
        element.find('li[role=tab]').each( function(){
            const id = $( this ).data('itabbed');
            tabs.push( id ? id : idx );
            idx += 1;
        });
        return tabs;
    };
    // public functions
    //  this window receives the focus
    //  change the route for reflecting the currently active tab
    $.fn.ITabbed.focus = function( window ){
        const tabs = _tabs( $( window ));
        const tabbed = $( window ).find( '.pwi-itabbed' )[0];
        if( tabbed ){
            const active = $( tabbed ).tabs( 'option', 'active' );
            const route = gtd.routeId( active, tabs[active] );
            if( route ){
                FlowRouter.go( route );
            }
        } else {
            throwError({ message:'Not an ITabbed window' });
            console.log( window );
        }
    };
}( jQuery ));
