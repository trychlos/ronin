/*
 * 'device_status' component.
 */
import './device_status.html';

Template.device_status.helpers({
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
