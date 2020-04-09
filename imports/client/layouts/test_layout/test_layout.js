/*
 * 'testLayout' layout.
 */
import './test_layout.html';

Template.testLayout.onRendered( function(){
    $( '.taskbar' ).taskbar();
    $( '.window' ).window({
        buttons: [
            {
                text: 'OK',
                click: function(){
                    console.log( $( '.ronin-layout' ));
                    $( '.ronin-layout' ).trigger( 'ronin.update' );
                }
            }
        ]
    });
});

Template.testLayout.events({
    'ronin.update'( ev, instance ){
        console.log( 'ronin.update' );
    }
})
