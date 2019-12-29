// Dump object properties
//
objDumpProps = function( o ){
    console.log( 'objDumpProps:' );
    for( var prop in o ){
        if( o.hasOwnProperty( prop )){
            console.log( '> '+prop+'='+o[prop] );
        }
    }
    //console.log( 'objDumpProps() End.' );
};

// return the type of the value as a string
//
typeOf = function( value ){
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (typeof value.length === 'number' &&
                    !(value.propertyIsEnumerable('length')) &&
                    typeof value.splice === 'function') {              
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}
