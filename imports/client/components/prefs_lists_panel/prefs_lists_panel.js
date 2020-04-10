/*
 * 'prefs_lists_panel' component.
 *
 *  Let the user choose, in windowLayout, if lists should be displayed as
 *  a list of expendable cards, or as a table.
 *
 *  This is a user+device preference. As such, this is not stored in the user
 *  collection, but locally on the current device.
 */
import './prefs_lists_panel.html';

Template.prefs_lists_panel.fn = {
    updatePrefs(){
        Ronin.prefs.local.lists = Template.prefs_lists_panel.fn.getContent();
    },
    getContent: function(){
        const $this = $( '.prefs-lists-panel' );
        const o = {
            actions: $this.find( 'input[name=actions]:checked' ).val(),
            setup: $this.find( 'input[name=setup]:checked' ).val(),
            thoughts: $this.find( 'input[name=thoughts]:checked' ).val()
        };
        return o;
    },
    initEditArea: function(){
        const prefs = Ronin.prefs.local.lists || {};
        const $this = $( '.prefs-lists-panel' );
        $this.find( 'input[name=actions][value='+prefs.actions+']' ).prop( 'checked', true );
        $this.find( 'input[name=setup][value='+prefs.setup+']' ).prop( 'checked', true );
        $this.find( 'input[name=thoughts][value='+prefs.thoughts+']' ).prop( 'checked', true );
    }
};

Template.prefs_lists_panel.onRendered( function(){
    Template.prefs_lists_panel.fn.initEditArea();
});

Template.prefs_lists_panel.helpers({
    listDefault(){
        return R_LIST_DEFAULT;
    },
    listCard(){
        return R_LIST_CARD;
    },
    listGrid(){
        return R_LIST_GRID;
    }
});
