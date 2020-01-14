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
