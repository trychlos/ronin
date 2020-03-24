/*
 * 'references_grid' component.
 *
 *  Display reference items in a grid.
 *
 *  NB: this references_grid is only displayed in windowLayout mode.
 *
 *  Rationale: see actions_grid.js
 *
 *  Parameters:
 *  - 'data': the layout context built in appLayout, and passed in by group layer.
 *
 *  Session variables:
 *  - setup.tab.name: the current tab.
 */
import './references_grid.html';

Template.references_grid.onRendered( function(){
    this.autorun(() => {
        $( '.references-grid' ).trigger( 'setup-tab-ready', {
            id: 'gtd-setup-refs',
            count: 0
        });
    });
});
