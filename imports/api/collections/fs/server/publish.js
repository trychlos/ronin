import { Meteor } from 'meteor/meteor';
import { FS } from '../fs.js';

// 'dir' is expected to have a trailing slash
//
// in production env:
//  process.env.PWD = /home/ronin/bundle
//  Mar 31 14:40:05 www8.trychlos.lan start.sh[25384]: [
//  Mar 31 14:40:05 www8.trychlos.lan start.sh[25384]:   '/home/ronin/bundle/programs/web.browser/app/res/apk/ronin-v20.03.31.2.apk',
//  Mar 31 14:40:05 www8.trychlos.lan start.sh[25384]:   '/home/ronin/bundle/programs/web.browser.legacy/app/res/apk/ronin-v20.03.31.2.apk',
//  Mar 31 14:40:05 www8.trychlos.lan start.sh[25384]:   '/home/ronin/bundle/programs/web.cordova/app/res/apk/ronin-v20.03.31.2.apk'
//  Mar 31 14:40:05 www8.trychlos.lan start.sh[25384]: ]
//
Meteor.publish( 'fs.bydir', function( dir ){
    const self = this;
    const find = require( 'find' );
    const path = require( 'path' );
    const rootdir = process.env.PWD + ( Meteor.isProduction ? '/programs/web.browser/app' : '/public' );
    find.file( /\.apk$/, rootdir+dir, function( fnames ){
        fnames.forEach( f => {
            const bname = path.basename( f );
            self.added( 'FS', bname, {
                url: dir+bname
            });
        });
    });
    this.ready();
});
