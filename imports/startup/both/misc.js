/*
 * /imports/startup/both/misc.js
 *
 *  Misceallenous functions.
 *
 *  As a reminder, keep in mind that it will be MUCH MORE EFFICIENT to invest
 *  some time to investigate among available methods of already installed JS
 *  packages.
 */

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

// compare updatedAt (resp createdAt) of the two provided objects
//  returns -1 if ita < (older) itb
//          +1 if ita > (newer) itb
//           0 if they are equal
//
compareUpdates = function( ita, itb ){
    const da = moment( ita.updatedAt ? ita.updatedAt : ita.createdAt );
    const db = moment( itb.updatedAt ? itb.updatedAt : itb.createdAt );
    if( da.isSame( db )){
        return 0;
    }
    return da.isBefore( db ) ? -1 : 1;
}
