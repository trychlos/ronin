/*
 * ronin-core package
 *  common/core/ronin.js
 *
 * Defines the Ronin global variable.
 *      The Ronin global variable is available both on the client and on the
 *      server, though its content may depend of the context.
 */

Ronin = {

    toArray( hash ){
        let array = [];
        Object.keys( hash ).forEach( key => {
            let o = { key:key };
            $.extend( true, o, hash[key] );
            array.push( o );
        });
        return array;
    },

    // return the content of the specified key in an object
    // where the key is specified as the 'key1.key2.key3' string
    objectKey( obj, key_str ){
        const keys = key_str.split( '.' );
        let o = obj;
        for( let i=0 ; i<keys.length ; ++i ){
            if( o[keys[i]] ){
                o = o[keys[i]];
            } else {
                return null;
            }
        }
        return o;
    }
};
