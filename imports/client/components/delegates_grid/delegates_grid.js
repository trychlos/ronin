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
 *  - 'data' passed from setup_tabs:
 *      > gtd: the GTD item, here 'gtd-setup-contexts'
 *      > items: the cursor to the setup elements.
 *
 *  Session variables:
 *  - setup.tab.name: the current tab.
 */
import { Delegates } from '/imports/api/collections/delegates/delegates.js';
import './delegates_grid.html';
