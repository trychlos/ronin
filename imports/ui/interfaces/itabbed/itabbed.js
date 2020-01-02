/*
 * 'ITabbed' pseudo-interface.
 *  To be used by every tabbed window.
 * 
 *  We have chosen to use jQuery Tabs.
 *  jQuery Tabs relies on a specific HTML markup
 *  see API documentation https://api.jqueryui.com/tabs/.
 * 
 *  As a consequence, it is expected that each <li> holds a 'data-itabbed'
 *  attribute, with the tab identifier as a value.
 *  This is not a jqxTabs requirement, but a ITabbed interface one.
 * 
 *  Properties:
 *  - tab (optional) tab identifier
 *  + all jQuery Tabs options.
 */
import { gtd } from '/imports/ui/interfaces/gtd/gtd.js';
import '/imports/ui/components/errors/errors.js'

( function( $ ){
    $.fn.ITabbed = function(){
        if( !this.length ){
            //throwError({ message: "no 'this' context here" });
            return;
        }
        const element = this;
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
        if( element.hasClass( 'pwi-itabbed' )){
            settings = Object.assign({}, opts );
        } else {
            settings = Object.assign({}, $.fn.ITabbed.defaults );
            $.extend( settings, opts );
            element.addClass( 'pwi-itabbed' );
        }
        //console.log( 'jqxTabs settings='+JSON.stringify( settings ));
        element.tabs( settings );
        // make sure the requested tab is activated
        if( specs.tab ){
            const idx = _index( element, specs.tab );
            element.tabs({ active: idx });
        }
        // events tracker
        element.on( 'activate', function( event, ui ){
            objDumpProps( event );
            objDumpProps( ui );
            /*
            var selectedTab = event.args.item;
            const tabs = _tabs( element );
            //console.log( JSON.stringify( event.args )); // {"item":2}
            const tab = tabs[selectedTab];
            const item = gtd.byId( tab );
            if( item && item.router ){
                FlowRouter.go( item.router );
            }
            */
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
}( jQuery ));
