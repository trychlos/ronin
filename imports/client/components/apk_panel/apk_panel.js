/*
 * 'apk_panel' component.
 */
import { FS } from '/imports/api/collections/fs/fs.js';
import './apk_panel.html';

Template.apk_panel.onCreated( function(){
    this.ronin = {
        dict: new ReactiveDict(),
        handle: this.subscribe( 'fs.bydir', '/res/apk/' )
    };
    this.ronin.dict.set( 'apk', null );
});

Template.apk_panel.onRendered( function(){
    this.autorun(() => {
        if( this.ronin.handle.ready()){
            const apk = FS.find().fetch()[0];
            this.ronin.dict.set( 'apk', apk );
        }
    });
});

Template.apk_panel.helpers({
    apkLabel(){
        const apk = Template.instance().ronin.dict.get( 'apk' );
        return 'Download '+( apk ? apk._id : '' );
    },
    apkUrl(){
        const apk = Template.instance().ronin.dict.get( 'apk' );
        return apk ? apk.url : '';
    }
});

/*
Template.apk_panel.events({
    'click .js-apk'( ev, instance ){
        const apk = instance.ronin.dict.get( 'apk' );
        HTTP.get( apk.url, {
            headers: {
                'Content-Type': 'application/vnd.android.package-archive',
                'Content-Disposition': 'attachment',
                filename: apk.url
            },
            npmRequestOptions: {
                encoding: null
            }
        }, ( e, res ) => {
            if( e ){
                console.log( e );
                messageError({ type:e.error, message:e.reason });
                return false;
            } else {
                console.log( res );
                messageSuccess( apk._id+' successfully downloaded' );
            }
        });
    }
});
*/
