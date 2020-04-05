/*
 * 'device_detect' component.
 */
import './device_detect.html';

Template.device_detect.helpers({
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
    }
});
