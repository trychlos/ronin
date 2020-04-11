/*
 * ronin-core package
 *  Action class
 *   Extends ActionBase class.
 */

Ronin.Action = class extends Ronin.ActionBase {
    constructor( type, action ){
        super();
        this.type = type;
        this.action = action;
    }
};
