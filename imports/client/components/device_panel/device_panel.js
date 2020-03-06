/*
 * 'device_panel' component.
 */
import './device_panel.html';

Template.device_panel.helpers({
    back(){
        return g.run.back;
    },
    deviceType(){
        return g.detectIt.deviceType;
    },
    hasMouse(){
        return g.detectIt.hasMouse ? 'true' : 'false';
    },
    hasTouch(){
        return g.detectIt.hasTouch ? 'true' : 'false';
    },
    height(){
        return g.run.height.get()+'px';
    },
    layout(){
        return g.run.layout.get();
    },
    primaryInput(){
        return g.detectIt.primaryInput;
    },
    width(){
        return g.run.width.get()+'px';
    }
});
