/*
 * 'layout_select' component.
 *  Display a drop-down dialog to select the display layout.
 *
 *  Parameters:
 *  - 'selected=id' (optional) initial selected status's identifier.
 */
import './layout_select.html';

Template.layout_select.helpers({
    layoutLabel(){
        return Ronin.ui.runLayout() === LYT_PAGE ? 'Page layout' : 'Window layout';
    },
    link(){
        return '<a class="dropdown-item" href="javascript:void(0);"'+
            ' data-ronin-layout="'+( Ronin.ui.runLayout() === LYT_PAGE ? LYT_WINDOW : LYT_PAGE )+'">'+
            ( Ronin.ui.runLayout() === LYT_PAGE ? 'Window layout' : 'Page layout' )+'</a>';
    }
});

Template.layout_select.events({
    'click .js-layout-select a'( event, instance ){
        //instance.$('.js-status-select').trigger('action-status-select-change');
        const layout = $( event.target ).attr( 'data-ronin-layout' );
        Ronin.ui.runLayout( layout );
    }
});
