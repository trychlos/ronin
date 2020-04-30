/*
 * ronin-core package
 *  core/managed-types.js
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

Ronin.managedTypes = {
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
    }
};
