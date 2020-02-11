/*
 * 'shadowWindow' window.
 */
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import '/imports/client/windows/thought_edit/thought_edit.js';
import './shadow_window.html';

Template.shadowWindow.onCreated( function(){
    this.windowed = new ReactiveVar( false );
});

Template.shadowWindow.onRendered( function(){
    const self = this;
    //console.log( this );
    // open the window if the manager has been initialized
    this.autorun(() => {
        if( g[LYT_WINDOW].taskbar.get()){
            console.log( 'calling IWindowed interface on shadowWindow' );
            $( '.shadowWindow' ).IWindowed({
                template: self.data.window,
                simone: {
                    /*
                    buttons: [
                        {
                            text: "Close",
                            click: function(){
                                Template.thoughtEdit.fn.actionClose();
                            }
                        },
                        {
                            text: "OK",
                            click: function(){
                                console.log( $( '.thoughtEdit' ));
                                $( '.thoughtEdit' ).trigger( 'ronin.update' );
                                //Template.thoughtEdit.fn.actionUpdate( self );
                            }
                        }
                    ],
                    */
                    group:  self.data.gtd,
                    title:  'Collect thoughts'
                }
            });
            this.windowed.set( true );
        }
    });
    /*
    this.autorun(() => {
        if( this.windowed.get()){
            const label = Template.thoughtEdit.fn.okLabel();
            $( '.thoughtEdit' ).IWindowed( 'buttonLabel', 1, label );
        }
    })
    $( '.thoughtEdit' ).on( 'ronin.update', function(){
        console.log( 'on ronin.update' );
    });
    */
    /*
    $( '.js-ok' ).click( function(){
        console.log( 'on js-ok click' );
    });
    */
});
