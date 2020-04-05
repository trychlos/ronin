/*
 * 'device_panel' component.
 */
import './device_panel.html';

Template.device_panel.helpers({
    detectDeviceType(){
        return Ronin.ui.detectIt.deviceType;
    },
    detectHasMouse(){
        return Ronin.ui.detectIt.hasMouse ? 'true' : 'false';
    },
    detectHasTouch(){
        return Ronin.ui.detectIt.hasTouch ? 'true' : 'false';
    },
    detectPrimaryInput(){
        return Ronin.ui.detectIt.primaryInput;
    },
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
