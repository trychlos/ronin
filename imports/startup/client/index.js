/*
 * /imports/startup/client/index.js
 *
 *  Client UI initialization code.
 *  All third-party imports go here.
 */

// bootstrap 4.x
import 'popper.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

// jQuery UI widgets are made globally available in the application
import 'jquery-ui-dist/jquery-ui.js';
import 'jquery-ui-dist/jquery-ui.css';

// jQuery context menu
//  https://swisnl.github.io/jQuery-contextMenu/
import 'jquery-contextmenu/dist/jquery.contextMenu.min.css';
import 'jquery-contextmenu/dist/jquery.contextMenu.min.js';
import 'jquery-contextmenu/dist/jquery.ui.position.min.js';

// FontAwesome are made globally available in the application
// NB: our free version include 'solid' and 'brand' icon styles
// see also https://fontawesome.com/how-to-use/on-the-web/setup/getting-started
import '@fortawesome/fontawesome-free/js/all.js';

// https://spin.js.org/
// https://github.com/fgnass/spin.js
import 'spin.js/spin.css';

// pub/sub paradigm (nonetheless far from an actual mqtt broker)
//import '/imports/client/interfaces/pubsub/pubsub.js'; http://fuzzytolerance.info doesn't work oob
import 'jquery-pubsub/dist/jquery.pubsub.min.js';

import './accounts-config.js';
import './blaze-helpers.js';
import './colorpicker-config.js';
import './datepicker-config.js';
import './version-config.js';

// compute the default layout
//  maybe initializing a window manager if the desktop layout is chosen
import './routes.js';

console.log( 'startup/client: Meteor.settings' );
console.log( Meteor.settings );
console.log( 'startup/client: Ronin' );
console.log( Ronin );
