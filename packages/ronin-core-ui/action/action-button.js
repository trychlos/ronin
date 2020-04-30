/*
 * ronin-core-ui package
 *  action/action-button.js: manage the buttons which have an action as a context parameter.
 */

// the action passed in the data context may be an Action object instance
//  or a function which is expected to return this Action object instance.
const _actionContext = function( context ){
    return context && context.action ? ( typeof context.action === 'function' ? context.action() : context.action ) : null;
}

// Please note that even if a disabled button doesn't trigger any event,
//  an uncatched click may still be handled by the englobing div
//  returning false here does prevent this bubbling
Ronin.activateActionButton = function( context ){
    const action = _actionContext( context );
    if( action ){
        action.activate();
    }
    return false;
}

Ronin.enableActionButton = function( context, $button ){
    const action = _actionContext( context );
    const activable = action ? action.activable() : false;
    if( activable ){
        $button.attr( 'disabled', false );
        $button.removeClass( 'ui-state-disabled' );
    } else {
        $button.attr( 'disabled', true );
        $button.addClass( 'ui-state-disabled' );
    }
}
