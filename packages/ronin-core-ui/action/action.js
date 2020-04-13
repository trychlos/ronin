/*
 * ronin-core package
 *  Action class.
 *
 *  Defines two base methods:
 *
 *  - activable():
 *      whether the Action si activable
 *      defaults to false
 *      '_activable' here is the definitive status of the activability of the action.
 *      It is the responsability of the derived class to keept it up to date.
 *
 *  - activate():
 *      activate the activable action
 *      publish the 'action.activate' message.
 */

const _private = new WeakMap();

Ronin.Action = function(){
    _private.set( this, {});        // private data
};

Ronin.Action.prototype.activable = function( activable ){
    if( activable !== null && activable !== undefined && typeof activable === 'boolean' ){
        this._activable = activable;
    }
    return Boolean( this._activable );
};

Ronin.Action.prototype.activate = function(){
    if( this.activable()){
        $.pubsub.publish( 'action.activate', _private.get( this ) || {});
    }
}

Ronin.Action.prototype.setUserData = function( userdata ){
    let priv = _private.get( this );
    priv.userdata = userdata;
    _private.set( this, priv );
}
