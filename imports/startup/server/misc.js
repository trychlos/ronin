/*
 * startup/server/misc.js
 */

// used in cleanup server-only collections functions
//  to make sure an object only contains keys with a non-null value
soSet = function( dest, src, name ){
    if( src[name] && src[name] !== 'none' ){
        dest.set[name] = src[name];
    } else {
        dest.unset[name] = '';
    }
}
