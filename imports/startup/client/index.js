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

// jqWidgets base code is made globally available in the application
//  notably used for jqxGrid (cf. IGrid interface) and jqxSplitter
import '/imports/client/third-party/jqwidgets/jqx.base.css';
import '/imports/client/third-party/jqwidgets/jqxcore-patched.js';

// statically import simone window manager to not run in dynamic problems
//  even if this is rather useless (as unused) in any touch device
//  http://cezarykluczynski.github.io/simone/docs/
import '/imports/client/third-party/simone/simone.min.js';
import '/imports/client/third-party/simone/i18n/simone.min.custom.js';
import '/imports/client/third-party/simone/simone.min.css';

import './accounts-config.js';
import './blaze-helpers.js';
import './colorpicker-config.js';
import './datepicker-config.js';

// compute the default layout
//  maybe initializing a window manager if the desktop layout is chosen
import './layout-config.js'
import './routes.js';
