/*
 * /imports/startup/client/version-config.js
 *  IIFE function
 */
(function(){
    if( process.env.NODE_ENV === 'development' ){
        const version = Meteor.settings.public.ronin.version;
        Meteor.settings.public.ronin.version = version+'-dev';
    }
})();
