/*
 * 'device_panel' component.
 */
import './device_panel.html';

Template.device_panel.helpers({
    detectDeviceType(){
        return g.detectIt.deviceType;
    },
    detectHasMouse(){
        return g.detectIt.hasMouse ? 'true' : 'false';
    },
    detectHasTouch(){
        return g.detectIt.hasTouch ? 'true' : 'false';
    },
    detectPrimaryInput(){
        return g.detectIt.primaryInput;
    },
    runBack(){
        return g.run.back;
    },
    runHeight(){
        return g.run.height.get()+'px';
    },
    runLayout(){
        return g.run.layout.get();
    },
    runWidth(){
        return g.run.width.get()+'px';
    },
    statusConnected(){
        return Meteor.status().connected;
    },
    statusReason(){
        return Meteor.status().reason;
    },
    statusRetryCount(){
        return Meteor.status().retryCount;
    },
    statusRetryTime(){
        const time = Meteor.status().retryTime;
        return time ? moment( time ).format( 'YYYY-MM-DD HH:mm:ss') : '';
    },
    statusStatus(){
        return Meteor.status().status;
    }
});
