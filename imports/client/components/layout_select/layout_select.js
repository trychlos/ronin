/*
 * 'layout_select' component.
 *  Display a drop-down dialog to select the display layout.
 *
 *  Parameters:
 *  - 'selected=id' (optional) initial selected status's identifier.
 */
import './layout_select.html';

Template.layout_select.fn = {
    // return the code associated to the selected action_status
    getSelected: function( selector ){
        const instance = Template.instance();
        return instance.view.isRendered ? instance.$( selector+' .js-status-select option:selected').val() : null;
    },
    // select a value
    setSelected: function( selector, value ){
        //console.log( 'setSelected '+value );
        const instance = Template.instance();
        if( instance.view.isRendered ){
            instance.$( selector+' .js-status-select' ).val( value );
        }
    },
};

Template.layout_select.helpers({
    desktopLayout(){
        return LYT_DESKTOP;
    },
    touchableLayout(){
        return LYT_TOUCH;
    }
});

Template.layout_select.events({
    'click .js-layout-select a'( event, instance ){
        //instance.$('.js-status-select').trigger('action_status_select-change');
        const layout = $( event.target ).data( 'pwi-layout' );
        g.device.curLayout.set( layout );
        amplify.store( 'ronin.lastLayout', layout );
    }
});
