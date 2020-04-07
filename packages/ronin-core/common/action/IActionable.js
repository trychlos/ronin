/*
 * ronin-core package.
 * IActionable interface.
 */
import './Action.js';

Action.prototype.IActionable = function( actionable ){
    if( typeof actionable === 'boolean' ){
        this.actionable = actionable;
    }
    return this.actionable;
}
