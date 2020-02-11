/*
 * Database operations status.
 *
 *  These status let us manage the asynchronous database operations.
 */

// before the operation
DBOPE_WAIT = 0;

// an errors has occured
//  stay in the page
//  does not reinitialize the form fields
DBOPE_ERROR = 1;

// successful operation
//  stay in the page
//  reinitialize the form fields
DBOPE_REINIT = 2;

// successful operation
//  leave the page
DBOPE_LEAVE = 3;
