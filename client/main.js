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
 *
 *  Startup process:
 *
 *  /client/main.js (this file)
 *   |
 *   +- /imports/startup/both/index.js
 *   |   |
 *   |   +- ./collections-config.js             Collections configurations
 *   |   +- ./misc.js                           Misceallenous functions
 *   |
 *   +- /imports/startup/client/index.js
 *       |
 *       +- import global client libs
 *       |  |
 *       |  +- jQuery UI js/css
 *       |  +- popper
 *       |  +- Bootstrap js/css
 *       |  +- jQuery Context Menu js/css
 *       |  +- Fontawesome js
 *       |  +- jqxWidgets base.css/core.js
 *       |  +- Simone js/css
 *       |
 *       +- ./colorpicker-config.js             Color-picker configuration
 *       +- ./datepicker-config.js              Date-picker configuration
 *       +- ./blaze-helpers.js                  Global Blaze helpers
 *       +- ./default-layout.js                 Default layout computing
 *       +- ./routes.js                         FlowRouter routes
 *
 *  Because an empty ('/') route is defined, the corresponding page is displayed
 *  as soon as the route exists in the system.
 */

import '/imports/startup/both';
import '/imports/startup/client';
