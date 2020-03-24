/*
 * 'delegates_grid' component.
 *
 *  Display reference items in a grid.
 *
 *  NB: this delegates_grid is only displayed in windowLayout mode.
 *
 *  Rationale: see actions_grid.js
 *
 *  Parameters:
 *  - 'data': the layout context built in appLayout, and passed in by group layer.
 *
 *  Session variables:
 *  - setup.tab.name: the current tab.
 */
import { Delegates } from '/imports/api/collections/delegates/delegates.js';
import './delegates_grid.html';

Template.delegates_grid.onRendered( function(){
    //
    this.autorun(() => {
        $( '.delegates-grid' ).trigger( 'setup-tab-ready', {
            id: 'gtd-setup-delegates',
            count: Delegates.find().count()
        });
    });
});
