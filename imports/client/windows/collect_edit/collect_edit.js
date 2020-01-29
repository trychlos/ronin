/*
 * 'collectEdit' window.
 *
 *  This page lets the user edit a thought.
 *
 *  Session variable:
 *  - collect.thought: the object to be edited, may be null.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> pageLayout { main, window }
 *              +-> collectPage { window, group }
 *                      +-> collectList { group }
 *                      +-> collectEdit { group }
 */
import '/imports/client/components/thought_edit/thought_edit.js';
import './collect_edit.html';
