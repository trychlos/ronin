/*
 * 'device_run' component.
 */
import './device_run.html';

Template.device_run.helpers({
    runAbsoluteUrl(){
        return Meteor.absoluteUrl();
    },
    runHeight(){
        return Ronin.ui.runHeight()+'px';
    },
    runHistoryLength(){
        return history.length;
    },
    runLayout(){
        return Ronin.ui.runLayout();
    },
    runWidth(){
        return Ronin.ui.runWidth()+'px';
    }
});
