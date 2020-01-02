/*
 * 'ITabbed' pseudo-interface.
 *  To be used by every tabbed window.
 * 
 *  We have chosen to use jqxTabs.
 *  jqxTabs does not make use of <li> id's, nor of any anchor, but relies
 *  instead on the order of the:
 *  - <ul><li>.... for the tabs
 *  - subsequent <div>'s for the contents.
 * 
 *  As a consequence, it is expected that each <li> holds a 'data-itabbed'
 *  attribute, with the tab identifier as a value.
 *  This is not a jqxTabs requirement, but a ITabbed interface one.
 * 
 *  Properties:
 *  - tab (optional) tab identifier
 *  + all jqxTabs options
 *    https://www.jqwidgets.com/jquery-widgets-documentation/documentation/jqxtabs/jquery-tabs-api.htm/
 */
import { gtd } from '/imports/ui/interfaces/gtd/gtd.js';
import '/imports/ui/components/errors/errors.js'
import '/imports/ui/third-party/jqwidgets/jqwidgets/styles/jqx.base.css';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxcore.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxtabs.js';

( function( $ ){
    $.fn.ITabbed = function(){
        if( !this.length ){
            throwError({ message: "no 'this' context here" });
            return;
        }
        const element = this;
        // are we calling a method on this interface ?
        if( arguments.length > 0 && typeof arguments[0] === 'string' ){
            const action = arguments[0];
            /* deal with action */
            return this;
        }
        const opts = arguments.length > 0 ? arguments[0] : {};
        // split between specific and jqxTabs properties
        //  Rationale: jqWidgets library refuse to work with extra props
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
        element.jqxTabs( settings );
        // make sure the requested tab is activated
        const idx = _index( element, Session.get('setup.tab.name'));
        element.jqxTabs({ selectedItem: idx });

        // events tracker
        element.on( 'selected', function( event ){
            var selectedTab = event.args.item;
            const tabs = _tabs( element );
            //console.log( JSON.stringify( event.args )); // {"item":2}
            const tab = tabs[selectedTab];
            const item = gtd.byId( tab );
            if( item && item.router ){
                FlowRouter.go( item.router );
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
}( jQuery ));
