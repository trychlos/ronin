/*
 * 'layout_select' component.
 *  Display a drop-down dialog to select the display layout.
 *
 *  Parameters:
 *  - 'mode'='text|icon|none'.
 */
import './layout_select.html';

Template.layout_select.helpers({
    hasMenu(){
        return this.mode !== 'none';
    },
    hasText(){
        return this.mode === 'text';
    },
    layoutLabel(){
        return Ronin.ui.runLayout() === R_LYT_PAGE ? 'Page layout' : 'Window layout';
    },
    link(){
        return '<a class="dropdown-item" href="javascript:void(0);"'+
            ' data-ronin-layout="'+( Ronin.ui.runLayout() === R_LYT_PAGE ? R_LYT_WINDOW : R_LYT_PAGE )+'">'+
            ( Ronin.ui.runLayout() === R_LYT_PAGE ? 'Window layout' : 'Page layout' )+'</a>';
    }
});

Template.layout_select.events({
    'click .js-layout-select a'( event, instance ){
        //instance.$('.js-status-select').trigger('action-status-select-change');
        const layout = $( event.target ).attr( 'data-ronin-layout' );
        Ronin.ui.runLayout( layout );
    }
});
