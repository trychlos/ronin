/*
 * /client/main.js
 *
 *  This is the main entry point of the client-side application.
 *  From this point, we initialize successively:
 *
 *  - from '/imports/startup/both', the both-server-and-client common code,
 *      typically for example the collections configurations along with some
 *      function available both sides.
 *      See /imports/startup/both/index.js
 *
 *  - from '/imports/startup/client', the client and UI specific code.
 *      See /imports/startup/client/index.js
 */

// Two defined entry points:
//  - first is shared with the server
//  - second is UI-specific.
//
import '/imports/startup/both';
import '/imports/startup/client';
