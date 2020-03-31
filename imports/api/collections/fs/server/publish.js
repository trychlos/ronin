import { Meteor } from 'meteor/meteor';
import { FS } from '../fs.js';

Meteor.publish( 'fs.bydir', function( dir ){
    const self = this;
    const fs = require( 'fs' );
    const path = process.env.PWD+'/public'+dir;
    fs.readdir( path, ( e, fnames ) => {
        fnames.forEach( f => {
            self.added( 'FS', f, {
                url: dir+f
            });
        });
    });
    this.ready();
});
