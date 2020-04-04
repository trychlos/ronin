Package.describe({
    name: 'pwi:ronin-core',
    version: '1.0.0',
    summary: 'Core common package for Ronin application',
    git: '',
    documentation: 'README.md'
});

Package.onUse( function( api ){
    api.versionsFrom( '1.8.1' );
    api.use( 'ecmascript' );
    api.mainModule( 'client/index.js', 'client' );
    api.mainModule( 'server/index.js', 'server' );
    api.export([
        'Ronin'
    ])
});

Package.onTest(function(api) {
    api.use( 'ecmascript' );
    api.use( 'tinytest' );
    api.use( 'pwi:ronin-core' );
    api.mainModule( 'ronin-core-tests.js' );
});
