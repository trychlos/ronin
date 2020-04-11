/*
 * ronin-core package
 *  common/core/index.js
 *
 * Defines the Ronin global variable.
 *      The Ronin global variable is available both on the client and on the
 *      server, though its content may depend of the context.
 */

// the managed object types
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

// the permissions managed in an environment basis, on settings.public
R_ACT_DELETE    = 'delete';
R_ACT_EDIT      = 'edit';
R_ACT_NEW       = 'new';

_managedArray = null;

Ronin = {

    // return the array of managed object types
    //
    managedArray(){
        if( !_managedArray ){
            _managedArray = [];
            Object.keys( Ronin.managedTypes ).forEach( key => {
                let o = { type:key };
                $.extend( true, o, Ronin.managedTypes[key] );
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

    // a list of permissions managed throught the environment-based Meteor.settings
    managedActions: [
        R_ACT_DELETE,
        R_ACT_EDIT,
        R_ACT_NEW
    ],

    // a list of description of main managed object types
    // unknwon object types default should throw an exception
    managedTypes: {
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
