Package.describe({
    name: 'pwi:ronin-core-ui',
    version: '1.0.0',
    summary: 'Ronin core user interface management',
    git: '',
    documentation: 'README.md'
});

Package.onUse( function( api ){
    configure( api );
    api.mainModule( 'ronin-core-ui.js', 'client' );
    api.export([
        'LYT_PAGE',
        'LYT_WINDOW'
    ])
});

Package.onTest( function( api ){
    configure( api );
    api.use('tinytest');
    api.use('pwi:ronin-core-ui');
    api.mainModule( 'ronin-core-ui-tests.js' );
});

function configure( api ){
    api.versionsFrom( '1.8.1' );
    api.use( 'ecmascript' );
    api.use( 'pwi:ronin-core' );
}

// The ronin-core-ui Meteor package depends of following NPM packages:
//  - detect-it
// Unfortunatly, we are unable to import these NPM packages from the Meteor
// package without having first imported them in the application :()
//Npm.depends({
//    'detect-it': 'git+https://github.com/rafrex/detect-it#master'
//});
