/*
 * ronin-core package.
 * IActionable interface.
 */
import './Action.js';

const _actionable = new WeakMap();

Ronin.Action.prototype.IActionable = function( actionable ){
    if( typeof actionable === 'boolean' ){
        _actionable.set( this, actionable );
    }
    return _actionable.get( this ) || false;
}
