/*
 * ronin-ui-prefs package
 *  lib/lists.js
 *
 * lists
 *  is a local user preference
 *  is stored as Ronin.prefs.local.lists
 *  contains
 *      setup: whether the setup lists are displayed as a grid or cards list
 *      thoughts: id.
 *      actions: id.
 */
import { Ronin } from 'meteor/pwi:ronin-core';

R_LIST_DEFAULT = 'default';
R_LIST_GRID = 'grid';
R_LIST_CARD = 'card';

_names = [
    'actions',
    'setup',
    'thoughts'
];

_formats = [
    R_LIST_DEFAULT,
    'card',
    'grid'
];

// getter / setter
//  name = setup|actions|thoughts
//  format = grid|card or unset
//  make sure the default is converted to grid or card, depending of the current layout
Ronin.prefs.listsPref = ( name, format ) => {
    if( !Ronin.prefs.local.lists ){
        Ronin.prefs.local.lists = {
            actions: R_LIST_DEFAULT,
            setup: R_LIST_DEFAULT,
            thoughts: R_LIST_DEFAULT
        };
    }
    if( !_names.includes( name )){
        throw 'Unkown name: '+name+', allowed values are ['+_names.join( ',' )+']';
    }
    if( format && _formats.includes( format )){
        Ronin.prefs.local.lists[name] = format;
    }
    let res = Ronin.prefs.local.lists[name];
    if( res === 'def' ){
        Ronin.prefs.local.lists[name] = R_LIST_DEFAULT;
        res = R_LIST_DEFAULT;
    }
    if( res === R_LIST_DEFAULT ){
        res = Ronin.ui.runLayout() === R_LYT_PAGE ? R_LIST_CARD : R_LIST_GRID;
    }
    return res;
}
