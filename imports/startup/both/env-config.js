/*
 * env-config.js
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
 */
console.log( '/imports/startup/both/env-config.js' );
console.log( Meteor.settings );
console.log( 'NODE_ENV='+process.env.NODE_ENV );
console.log( 'Meteor.isClient='+Meteor.isClient );
console.log( 'Meteor.isServer='+Meteor.isServer );
console.log( 'Meteor.isCordova='+Meteor.isCordova );
console.log( 'Meteor.isDevelopment='+Meteor.isDevelopment );
console.log( 'Meteor.isProduction='+Meteor.isProduction );
