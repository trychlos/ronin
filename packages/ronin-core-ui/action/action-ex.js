/*
 * ronin-core-ui package
 *  ActionEx class
 *   Extends Action function class.
 *
 *  Inheriting from Action class, this one extends the activable() method
 *  to take into account the environment settings
 */

const _private = new WeakMap();

Ronin.ActionEx = function( type, action, userdata ){
    Ronin.Action.call( this );
    this._type = type;
    this._action = action;
    Ronin.Action.prototype.setUserData.call( this, { type:type, action:action, data:userdata });
    let priv = {};
    _private.set( this, priv );
    // just a shortcut as this is not supposed to be reactive
    this._allowed = Meteor.settings.isAllowed( type, action );
    // the allowed state is also the activability initial status
    Ronin.Action.prototype.activable.call( this, this._allowed );
};

Ronin.ActionEx.prototype = Object.create( Ronin.Action.prototype );

// set the action activable
//  this is always dependant of the allowed status from the settings
Ronin.ActionEx.prototype.activable = function( activable ){
    if( activable !== null && activable !== undefined && typeof activable === 'boolean' ){
        Ronin.Action.prototype.activable.call( this, activable && this._allowed );
    }
    return Ronin.Action.prototype.activable.call( this );
}

//let o = new Ronin.ActionEx( R_OBJ_CONTEXT, R_ACT_DELETE );
//console.log( o );
//console.log( o.activable());
//console.log( o.activate());
