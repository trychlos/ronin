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

let _list = [];
let _userId = null;
const _private = new WeakMap();

Ronin.ActionEx = function( type, action, userdata ){
    Ronin.Action.call( this );
    _list.push( this );
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
        this._activable = activable;
        Ronin.Action.prototype.activable.call( this, activable && this._allowed );
    }
    return Ronin.Action.prototype.activable.call( this );
}

Tracker.autorun(() => {
    if( _userId !== Meteor.userId()){
        _list.forEach( action => {
            if( typeof action === 'object' ){
                action._allowed = Meteor.settings.isAllowed( action._type, action._action );
                Ronin.Action.prototype.activable.call( this, action._activable && action._allowed );
            }
        });
        _userId = Meteor.userId();
    }
});

//let o = new Ronin.ActionEx( R_OBJ_CONTEXT, R_ACT_DELETE );
//console.log( o );
//console.log( o.activable());
//console.log( o.activate());
