/*
 * 'thoughts_list' component.
 *  Display the specified list of thoughts, giving a cursor (aka an array)
 *
 *  Parameters:
 *  - thoughts: the cursor (aka an array) to be displayed
 */
import '/imports/client/components/prefs_lists_panel/prefs_lists_panel.js';
import '/imports/client/components/thoughts_grid/thoughts_grid.js';
import '/imports/client/components/thought_card/thought_card.js';
import './thoughts_list.html';

Template.thoughts_list.helpers({
    // use the user+device preferences to choose between cards and grid
    //  default is layout dependant
    tabularIsPreferred(){
        const prefs = Template.prefs_lists_panel.fn.readDevicePrefs();
        let display = prefs.lists.thoughts;
        if( display === 'def' ){
            display = Ronin.ui.runLayout() === LYT_PAGE ? 'cards' : 'grid';
        }
        return display === 'grid';
    }
});

Template.thoughts_list.events({
    // when cards are shown instead of grid (pageLayout default)
    'ronin-collapse-all'( ev, instance ){
        $( '.thoughts-list-item' ).removeClass( 'x-opened' );
    }
});
