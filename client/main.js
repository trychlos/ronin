// jQuery UI widgets are made globally available in the application
import 'jquery-ui-dist/jquery-ui.js';
import 'jquery-ui-dist/jquery-ui.css';

// FontAwesome are made globally available in the application
// nb: our free version include 'solid' and 'brand' icon styles
// see also https://fontawesome.com/how-to-use/on-the-web/setup/getting-started
import '@fortawesome/fontawesome-free/js/all.js';

// Client entry point, imports all client code
import '/imports/startup/both';
import '/imports/startup/client';
