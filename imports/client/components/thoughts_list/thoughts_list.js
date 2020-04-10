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

Template.thoughts_list.fn = {
    tabular( instance ){
        instance.ronin.dict.set( 'tabular', Ronin.prefs.listsPref( 'thoughts' ) === R_LIST_GRID );
    }
};

Template.thoughts_list.onCreated( function(){
    const self = this;
    const fn = Template.thoughts_list.fn;

    this.ronin = {
        dict: new ReactiveDict()
    };
    fn.tabular( self );

    $.pubsub.subscribe( 'ronin.ui.prefs.updated', ( msg ) => {
        fn.tabular( self );
    });
});

Template.thoughts_list.helpers({
    // use the user+device preferences to choose between cards and grid
    //  default is layout dependant
    tabularIsPreferred(){
        return Template.instance().ronin.dict.get( 'tabular' );
    }
});

Template.thoughts_list.events({
    // when cards are shown instead of grid (pageLayout default)
    'ronin-collapse-all'( ev, instance ){
        $( '.thoughts-list-item' ).removeClass( 'x-opened' );
    }
});
