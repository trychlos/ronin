// jQuery UI widgets are made globally available in the application
import 'jquery-ui-dist/jquery-ui.js';
import 'jquery-ui-dist/jquery-ui.css';

// import simone window manager
import '/imports/ui/third-party/simone/simone.min.js';
import '/imports/ui/third-party/simone/i18n/simone.min.custom.js';
import '/imports/ui/third-party/simone/simone.min.css';
g = {
    barSideWidth: 150,
    barTopHeight: 30,
    taskbar: new ReactiveVar( null )
};

// FontAwesome are made globally available in the application
// nb: our free version include 'solid' and 'brand' icon styles
// see also https://fontawesome.com/how-to-use/on-the-web/setup/getting-started
import '@fortawesome/fontawesome-free/js/all.js';

// Client entry point, imports all client code
import '/imports/startup/both';
import '/imports/startup/client';
