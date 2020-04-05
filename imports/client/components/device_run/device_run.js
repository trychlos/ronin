/*
 * 'device_run' component.
 */
import './device_run.html';

Template.device_run.helpers({
    runAbsoluteUrl(){
        return Meteor.absoluteUrl();
    },
    runBack(){
        return Ronin.ui.runBack();
    },
    runHeight(){
        return Ronin.ui.runHeight()+'px';
    },
    runLayout(){
        return Ronin.ui.runLayout();
    },
    runWidth(){
        return Ronin.ui.runWidth()+'px';
    }
});
