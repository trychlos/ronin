/*
 * ronin-core-ui package
 *  ActionEx class
 *   Extends Action function class.
 *
 *  Inheriting from Action class, this one extends the activable() method
 *  to take into account the environment settings regarding the logged-in
 *  connnection status.
 */
import { Tracker } from 'meteor/tracker';

const _ex_private = new WeakMap();

Ronin.ActionEx = function( type, action, userdata ){
    Ronin.Action.call( this );
    this._ex_type = type;
    this._ex_action = action;
    this._ex_activable = false;
    Ronin.Action.prototype.setUserData.call( this, { type:type, action:action, data:userdata });
    // be reactive
    const self = this;
    Tracker.autorun(() => {
        let priv = {
            userId: Meteor.userId()
        };
        _ex_private.set( self, priv );
        self._allowed = Meteor.settings.isAllowed( self._ex_type, self._ex_action );
        Ronin.Action.prototype.activable.call( self, self._ex_activable && self._allowed );
    });
};

Ronin.ActionEx.prototype = Object.create( Ronin.Action.prototype );

// set the action activable
//  this is always dependant of the allowed status from the settings
Ronin.ActionEx.prototype.activable = function( activable ){
    if( activable !== null && activable !== undefined && typeof activable === 'boolean' ){
        this._ex_activable = activable;
        Ronin.Action.prototype.activable.call( this, activable && this._allowed );
    }
    return Ronin.Action.prototype.activable.call( this );
}

//let o = new Ronin.ActionEx( R_OBJ_CONTEXT, R_ACT_DELETE );
//console.log( o );
//console.log( o.activable());
//console.log( o.activate());
