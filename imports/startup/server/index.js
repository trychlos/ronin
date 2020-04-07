/*
 * Import server startup through a single index entry point
 */

import './collections.js';
import './check.js';

console.log( 'startup/server: Meteor.settings' );
console.log( Meteor.settings );
console.log( 'startup/server: Ronin' );
console.log( Ronin );
