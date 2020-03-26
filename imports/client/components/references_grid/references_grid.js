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
 *  - 'data' passed from setup_tabs:
 *      > gtd: the GTD item, here 'gtd-setup-contexts'
 *      > items: the cursor to the setup elements.
 *
 *  Session variables:
 *  - setup.tab.name: the current tab.
 */
import { References } from '/imports/api/collections/references/references.js';
import './references_grid.html';
