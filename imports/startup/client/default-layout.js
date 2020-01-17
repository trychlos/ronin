/*
 * /imports/startup/client/default-layout.js
 *
 *  Client UI initialization code.
 */

console.log( $.jqx.mobile.isTouchDevice());
alert( 'touchDevice='+$.jqx.mobile.isTouchDevice());

// import simone window manager
import '/imports/client/third-party/simone/simone.min.js';
import '/imports/client/third-party/simone/i18n/simone.min.custom.js';
import '/imports/client/third-party/simone/simone.min.css';
g = {
    barSideWidth:   150,
    barTopHeight:    30,
    settingsPrefix: 'settings-',
    rootId:         '25d211fe-06ba-4781-ae41-c5a20e66075d',
    taskbar:         new ReactiveVar( null )
};
