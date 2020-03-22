/*
 * env-config.js
 *
 * About https://atmospherejs.com/4commerce/env-settings
 *  This is our choice for reading settings depending of the current environment.
 *  It has been copied from github into packages/ subdirectory
 *  and then installed by 'meteor add env-settings' which knows about this local package.
 *
 * About environment identification
 *  It happens that node in general, and Meteor in particular know only about
 *  'development' and 'production' environments.
 *  NODE_ENV='production' identifies a production environment, but only when run
 *  from the built bundle.
 *  Anywhere else, and whatever the NODE_ENV be set, Meteor forces the value to
 *  be 'development', which may lead to some inconsistencies between server and
 *  client sides (as of Meteor 1.10).
 *
 *  We so use a RONIN_ENV variable to identify our running environment in settings:
 *  - dev.1 is our first development environment (XPS13)
 *  - prod.1 is our first production environment (https://ronin.trychlos.org on www8).
 *
 *  Also, it happens that the RONIN_ENV variable is not forwarded client-side,
 *  which has so to rely on the public.runtime.roninEnv settings key.
 *
 * Meteor default development environment on XPS13
 *  Server-side
        I20200321-09:27:23.068(1)? /imports/startup/both/env-config.js
        I20200321-09:27:23.069(1)? { public: {} }
        I20200321-09:27:23.070(1)? NODE_ENV=development
        I20200321-09:27:23.070(1)? Meteor.isClient=false
        I20200321-09:27:23.070(1)? Meteor.isServer=true
        I20200321-09:27:23.071(1)? Meteor.isCordova=false
        I20200321-09:27:23.071(1)? Meteor.isDevelopment=true
        I20200321-09:27:23.071(1)? Meteor.isProduction=false
 *
 *  Client-side
        /imports/startup/both/env-config.js env-config.js:4:8
        Object { public: {…} }
        env-config.js:5:8
        NODE_ENV=development env-config.js:6:8
        Meteor.isClient=true env-config.js:7:8
        Meteor.isServer=false env-config.js:8:8
        Meteor.isCordova=false env-config.js:9:8
        Meteor.isDevelopment=true env-config.js:10:8
        Meteor.isProduction=false
 *
 * Meteor running environment on www8 as of v20.03.21.3
 *  Server-side
        Mar 21 09:39:12 www8.trychlos.lan start.sh[16263]: /imports/startup/both/env-config.js
        Mar 21 09:39:12 www8.trychlos.lan start.sh[16263]: { public: {} }
        Mar 21 09:39:12 www8.trychlos.lan start.sh[16263]: NODE_ENV=prod
        Mar 21 09:39:12 www8.trychlos.lan start.sh[16263]: Meteor.isClient=false
        Mar 21 09:39:12 www8.trychlos.lan start.sh[16263]: Meteor.isServer=true
        Mar 21 09:39:12 www8.trychlos.lan start.sh[16263]: Meteor.isCordova=false
        Mar 21 09:39:12 www8.trychlos.lan start.sh[16263]: Meteor.isDevelopment=true
        Mar 21 09:39:12 www8.trychlos.lan start.sh[16263]: Meteor.isProduction=false
 *
 *  Client-side
        /imports/startup/both/env-config.js
        ebdc91e1dff844baa5b0e38638744f9a76daf16e.js?meteor_js_resource=true:494 {public: {…}}
        ebdc91e1dff844baa5b0e38638744f9a76daf16e.js?meteor_js_resource=true:494 NODE_ENV=production
        ebdc91e1dff844baa5b0e38638744f9a76daf16e.js?meteor_js_resource=true:494 Meteor.isClient=true
        ebdc91e1dff844baa5b0e38638744f9a76daf16e.js?meteor_js_resource=true:494 Meteor.isServer=false
        ebdc91e1dff844baa5b0e38638744f9a76daf16e.js?meteor_js_resource=true:494 Meteor.isCordova=false
        ebdc91e1dff844baa5b0e38638744f9a76daf16e.js?meteor_js_resource=true:494 Meteor.isDevelopment=true
        ebdc91e1dff844baa5b0e38638744f9a76daf16e.js?meteor_js_resource=true:494 Meteor.isProduction=false
 *
 * Meteor running environment on www8 as of v20.03.21.4
 *  ~ronin/start.sh have NODE_ENV=production
 *  Server-side
        Mar 21 09:39:12 www8.trychlos.lan start.sh[16263]: /imports/startup/both/env-config.js
        Mar 21 09:39:12 www8.trychlos.lan start.sh[16263]: { public: {} }
        Mar 21 09:39:12 www8.trychlos.lan start.sh[16263]: NODE_ENV=production
        Mar 21 09:39:12 www8.trychlos.lan start.sh[16263]: Meteor.isClient=false
        Mar 21 09:39:12 www8.trychlos.lan start.sh[16263]: Meteor.isServer=true
        Mar 21 09:39:12 www8.trychlos.lan start.sh[16263]: Meteor.isCordova=false
        Mar 21 09:39:12 www8.trychlos.lan start.sh[16263]: Meteor.isDevelopment=false
        Mar 21 09:39:12 www8.trychlos.lan start.sh[16263]: Meteor.isProduction=true
 *
 *  Client-side
        /imports/startup/both/env-config.js
        ebdc91e1dff844baa5b0e38638744f9a76daf16e.js?meteor_js_resource=true:494 {public: {…}}
        ebdc91e1dff844baa5b0e38638744f9a76daf16e.js?meteor_js_resource=true:494 NODE_ENV=production
        ebdc91e1dff844baa5b0e38638744f9a76daf16e.js?meteor_js_resource=true:494 Meteor.isClient=true
        ebdc91e1dff844baa5b0e38638744f9a76daf16e.js?meteor_js_resource=true:494 Meteor.isServer=false
        ebdc91e1dff844baa5b0e38638744f9a76daf16e.js?meteor_js_resource=true:494 Meteor.isCordova=false
        ebdc91e1dff844baa5b0e38638744f9a76daf16e.js?meteor_js_resource=true:494 Meteor.isDevelopment=false
        ebdc91e1dff844baa5b0e38638744f9a76daf16e.js?meteor_js_resource=true:494 Meteor.isProduction=true
 *
 */
Meteor.startup( function(){
    if( Meteor.isServer ){
        console.log( '/imports/startup/both/env-config.js' );
        console.log( Meteor.settings );
        console.log( 'RONIN_ENV='+process.env.RONIN_ENV );
        console.log( 'NODE_ENV='+process.env.NODE_ENV );
        console.log( 'Meteor.isClient='+Meteor.isClient );
        console.log( 'Meteor.isServer='+Meteor.isServer );
        console.log( 'Meteor.isCordova='+Meteor.isCordova );
        console.log( 'Meteor.isDevelopment='+Meteor.isDevelopment );
        console.log( 'Meteor.isProduction='+Meteor.isProduction );
    }
});
