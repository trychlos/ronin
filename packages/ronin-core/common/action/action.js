/*
 * ronin-core package
 *  Action class.
 *
 *  Defines two base methods:
 *
 *  - activable():
 *      whether the Action is activable
 *      defaults to false
 *      '_act_activable' here is the definitive status of the activability of the action.
 *      It is the responsability of the derived class to keep it up to date.
 *
 *  - activate():
 *      activate the activable action
 *      publish the 'action.activated' message.
 */
import { ReactiveVar } from 'meteor/reactive-var';

const _act_private = new WeakMap();

Ronin.Action = function(){
    _act_private.set( this, {});        // private data
    this._act_activable = new ReactiveVar( false );
};

Ronin.Action.prototype.activable = function( activable ){
    //console.log( 'Action.activable() '+activable );
    if( activable !== null && activable !== undefined && typeof activable === 'boolean' ){
        this._act_activable.set( activable );
    }
    return this._act_activable.get();
};

Ronin.Action.prototype.activate = function(){
    if( this.activable()){
        //console.log( 'publishing action.activated msg' );
        $.pubsub.publish( 'action.activated', _act_private.get( this ) || {});
    }
}

Ronin.Action.prototype.setUserData = function( data ){
    let priv = _act_private.get( this );
    priv.data = data;
    _act_private.set( this, priv );
}
