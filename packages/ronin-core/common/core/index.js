/*
 * ronin-core package
 *  common/core/index.js
 *
 * Defines the Ronin global variable.
 *      The Ronin global variable is available both on the client and on the
 *      server, though its content may depend of the context.
 */

R_OBJ_ACTION    = 'A';
R_OBJ_CONTEXT   = 'C';
R_OBJ_DELEGATE  = 'D';
R_OBJ_ENERGY    = 'E';
R_OBJ_MAYBE     = 'M';
R_OBJ_PRIORITY  = 'R';
R_OBJ_PROJECT   = 'P';
R_OBJ_REFERENCE = 'F';
R_OBJ_TIME      = 'I';
R_OBJ_THOUGHT   = 'T';
R_OBJ_TOPIC     = 'O';

_managedArray = null;

Ronin = {

    // return the array of managed object types
    //
    managedArray(){
        if( !_managedArray ){
            _managedArray = [];
            Object.keys( Ronin.managed ).forEach( key => {
                let o = { type:key };
                $.extend( true, o, Ronin.managed[key] );
                _managedArray.push( o );
            });
        }
        return _managedArray;
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
    },

    // a list of description of main managed object types
    // unknwon object types default should throw an exception
    managed: {
        A: {
            label: 'Action'
        },
        C: {
            label: 'Context'
        },
        D: {
            label: 'Delegate'
        },
        E: {
            label: 'Energy'
        },
        F: {
            label: 'Reference'
        },
        I: {
            label: 'Time'
        },
        M: {
            label: 'Maybe'
        },
        O: {
            label: 'Topic'
        },
        P: {
            label: 'Project'
        },
        R: {
            label: 'Priority'
        },
        T: {
            label: 'Thought'
        },
    }
};
