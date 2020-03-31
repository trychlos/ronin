/*
 * 'apk_panel' component.
 */
import './apk_panel.html';

Template.apk_panel.onCreated( function(){
    this.ronin = {
        dict: new ReactiveDict()
    };
});

Template.apk_panel.helpers({
    apkHref(){

    },
    apkLabel(){

    }
});
