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
import { ReactiveDict } from 'meteor/reactive-dict';

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
        let priv = _ex_private.get( self ) || new ReactiveDict();
        const userId = Meteor.userId();
        if( priv.get( 'userId' ) !== userId ){
            priv.set( 'userId', userId );
            priv.set( 'allowed', Meteor.settings.isAllowed( type, action ));
            _ex_private.set( self, priv );
        }
        //console.log( type+' '+action+' '+self._ex_activable );
        Ronin.Action.prototype.activable.call( self, self._ex_activable && priv.get( 'allowed' ));
    });
};

Ronin.ActionEx.prototype = Object.create( Ronin.Action.prototype );

// set the action activable
//  this is always dependant of the allowed status from the settings
Ronin.ActionEx.prototype.activable = function( activable ){
    if( activable !== null && activable !== undefined && typeof activable === 'boolean' ){
        this._ex_activable = activable;
        const priv = _ex_private.get( this );
        Ronin.Action.prototype.activable.call( this, activable && priv.get( 'allowed' ));
    }
    return Ronin.Action.prototype.activable.call( this );
}

//let o = new Ronin.ActionEx( R_OBJ_CONTEXT, R_ACT_DELETE );
//console.log( o );
//console.log( o.activable());
//console.log( o.activate());
