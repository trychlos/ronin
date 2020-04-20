/*
 * ronin-ui-prefs package.
 *
 * This package manages the user preferences.
 *
 * It extends the Ronin global (from pwi:ronin-core) by adding to it:
 * - a 'prefs' key, which holds all user preferences,
 * - maybe with a 'prefs.local' key which specifically holds preferences for a local device,
 *
 * It exhibits the API:
 * - Ronin.prefs.save(): save the current user preferences
 * - Ronin.prefs.listsPref( name [, format] ): getter/setter for 'lists' preference
 *
 * NB: if no user is currently logged-in, then only local preferences may be updated.
 */
Package.describe({
    name: 'pwi:ronin-ui-prefs',
    version: '1.0.2',
    summary: 'User prefences management',
    git: '',
    documentation: 'README.md'
});

Package.onUse( function( api ){
    configure( api );
    api.mainModule( 'ronin-ui-prefs.js', 'client' );
    api.export([
        'R_LIST_DEFAULT',
        'R_LIST_GRID',
        'R_LIST_CARD'
    ])
});

Package.onTest( function( api ){
    configure( api );
    api.use('tinytest');
    api.mainModule( 'ronin-core-ui-tests.js', 'client' );
});

function configure( api ){
    api.versionsFrom( '1.8.1' );
    api.use( 'ecmascript' );
    api.use( 'jquery' );
    api.use( 'tracker' );
    api.use( 'pwi:ronin-core-ui' );
}
