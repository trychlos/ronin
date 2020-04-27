/*
 * ronin-core package
 *  Action class.
 *
 *  Defines two base methods:
 *
 *  - activable():
 *      whether the Action is activable
 *      defaults to false
 *      '_action_activable' here is the definitive status of the activability of the action.
 *      It is the responsability of the derived class to keep it up to date.
 *
 *  - activate():
 *      activate the activable action
 *      publish the 'action.activate' message.
 */
import { ReactiveVar } from 'meteor/reactive-var';

const _action_private = new WeakMap();

Ronin.Action = function(){
    _action_private.set( this, {});        // private data
    this._action_activable = new ReactiveVar( false );
};

Ronin.Action.prototype.activable = function( activable ){
    if( activable !== null && activable !== undefined && typeof activable === 'boolean' ){
        this._action_activable.set( activable );
    }
    return this._action_activable.get();
};

Ronin.Action.prototype.activate = function(){
    if( this.activable()){
        //console.log( 'publishing action.activate msg' );
        $.pubsub.publish( 'action.activate', _action_private.get( this ) || {});
    }
}

Ronin.Action.prototype.setUserData = function( userdata ){
    let priv = _action_private.get( this );
    priv.userdata = userdata;
    _action_private.set( this, priv );
}
