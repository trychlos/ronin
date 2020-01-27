/*
 * 'layout_select' component.
 *  Display a drop-down dialog to select the display layout.
 *
 *  Parameters:
 *  - 'selected=id' (optional) initial selected status's identifier.
 */
import './layout_select.html';

Template.layout_select.helpers({
    desktopLayout(){
        return LYT_WINDOW;
    },
    touchableLayout(){
        return LYT_PAGE;
    }
});

Template.layout_select.events({
    'click .js-layout-select a'( event, instance ){
        //instance.$('.js-status-select').trigger('action_status_select-change');
        const layout = $( event.target ).data( 'pwi-layout' );
        g.run.layout.set( layout );
        g.store.layout = layout;
        amplify.store( 'ronin', g.store );
        console.log( 'changing layout to '+layout );
    }
});
