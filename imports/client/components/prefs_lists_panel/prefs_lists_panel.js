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
    defaultPrefs(){
        return {
            lists: {
                thoughts: 'def',
                actions:  'def'
            }
        }
    },
    doOK(){
        const prefs = Template.prefs_lists_panel.fn.getContent();
        Template.prefsWindow.fn.writeDevicePrefs({ lists:prefs });
    },
    getContent: function(){
        const $this = $( '.prefs-lists-panel' );
        const o = {
            thoughts: $this.find( 'input[name=thoughts]:checked' ).val(),
            actions: $this.find( 'input[name=actions]:checked' ).val()
        };
        return o;
    },
    initEditArea: function(){
        const prefs = $.extend( true, {},
            Template.prefs_lists_panel.fn.defaultPrefs(),
            Template.prefsWindow.fn.readDevicePrefs());
        const $this = $( '.prefs-lists-panel' );
        $this.find( 'input[name=thoughts][value='+prefs.lists.thoughts+']' ).prop( 'checked', true );
        $this.find( 'input[name=actions][value='+prefs.lists.actions+']' ).prop( 'checked', true );
    }
};

Template.prefs_lists_panel.onRendered( function(){
    Template.prefs_lists_panel.fn.initEditArea();
});

Template.prefs_lists_panel.helpers({
});
