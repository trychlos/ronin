Package.describe({
    name: 'pwi:ronin-action-status',
    version: '1.0.0',
    summary: 'Manages the status of an action',
    git: '',
    documentation: 'README.md'
});

Package.onUse(( api ) => {
    api.versionsFrom( '1.8.1' );
    api.use( 'ecmascript' );
    api.mainModule( 'action_status.js' );
});

/*
Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('pwi:ronin-action-status');
  api.mainModule('ronin-action-status-tests.js');
});
*/
