/*
 * ronin-core package
 *  Action class
 *  Implements IActionable interface.
 */
Action = class {
    actionable = false;

    constructor( actionable ){
        this.actionable = Boolean( actionable );
    }
};
