/*
 * ronin-core package.
 * Activable interface.
 */
import './ActionBase.js';

const _actionable = new WeakMap();

Ronin.ActionBase.prototype.Activable = function( actionable ){
    if( typeof actionable === 'boolean' ){
        _actionable.set( this, actionable );
    }
    return _actionable.get( this ) || false;
}

Ronin.ActionBase.prototype.activate = function(){
    if( !this.Activable()){
        throw "Trying to activate an unactivable action";
    }
    $.pubsub.publish( 'action.activated', { this:this });
}
