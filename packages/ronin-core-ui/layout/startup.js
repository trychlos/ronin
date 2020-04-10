/*
 * ronin-core-ui package
 *  layout/startup.js
 */

if( Meteor.isClient ){

    Meteor.startup(() => {
        window.addEventListener( 'resize', () => {
            Ronin.ui.runResize( new Date());
            Ronin.ui.runHeight( $( window ).height());
            Ronin.ui.runWidth( $( window ).width());
        });
    });

} // Meteor.isClient
