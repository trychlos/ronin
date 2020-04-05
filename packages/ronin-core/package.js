Package.describe({
    name: 'pwi:ronin-core',
    version: '1.1.0',
    summary: 'Core common package for Ronin application',
    git: '',
    documentation: 'README.md'
});

Package.onUse( function( api ){
    configure( api );
    api.export([
        'Ronin'
    ])
});

Package.onTest( function( api ){
    configure( api );
    api.use( 'tinytest' );
    api.use( 'pwi:ronin-core' );
    api.mainModule( 'ronin-core-tests.js' );
});

function configure( api ){
    api.versionsFrom( '1.8.1' );
    api.use( 'ecmascript' );
    api.use( 'env-settings' );
    api.addFiles( 'client/index.js', 'client' );
    api.addFiles( 'server/index.js', 'server' );
}
