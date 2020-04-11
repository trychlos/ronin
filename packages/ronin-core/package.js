Package.describe({
    name: 'pwi:ronin-core',
    version: '1.4.0',
    summary: 'Core common package for Ronin application',
    git: '',
    documentation: 'README.md'
});

Package.onUse( function( api ){
    configure( api );
    api.export([
        'Ronin',
        'R_ACT_DELETE',
        'R_ACT_EDIT',
        'R_ACT_NEW',
        'R_OBJ_ACTION',
        'R_OBJ_CONTEXT',
        'R_OBJ_DELEGATE',
        'R_OBJ_ENERGY',
        'R_OBJ_MAYBE',
        'R_OBJ_PRIORITY',
        'R_OBJ_PROJECT',
        'R_OBJ_REFERENCE',
        'R_OBJ_TIME',
        'R_OBJ_THOUGHT',
        'R_OBJ_TOPIC'
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
