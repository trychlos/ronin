/*
 * ronin-core package - common part.
 */

//console.log( this );
// 'this' here is a Meteor object which contains some global functions and
//  packages objects (but not ours :(...)

import './core';

Meteor.startup( function(){
    if( Meteor.isServer ){
        console.log( 'pwi:ronin-core::common' );
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
