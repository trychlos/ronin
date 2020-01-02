/*
 * 'date_select' component.
 *  Let the user select a date.
 *  Parameters:
 *  - date: date to be set (default is none).
 */
import { Meteor } from 'meteor/meteor';
import './date_select.html';

Template.date_select.fn = {
    // return the currently selected date in ISO format
    //  e.g. 'Sun Dec 22 2019 00:00:00 GMT+0100 (Central European Standard Time)'
    getDate: function( selector ){
        const instance = Template.instance();
        return instance.view.isRendered ? instance.$(selector+' .js-date-select input').datepicker('getDate') : null;
    },
    // set the default date
    //  converting ISO to our display format
    setDate: function( selector, date ){
        const instance = Template.instance();
        if( instance.view.isRendered ){
            instance.$(selector+' .js-date-select input').datepicker('setDate',date);
        }
    },
    // set an option
    setOption: function( selector, name, value ){
        const instance = Template.instance();
        if( instance.view.isRendered ){
            instance.$(selector+' .js-date-select input').datepicker('option',name,value);
        }
    }
};

Template.date_select.onRendered( function(){
    this.$(' .js-date-select input').datepicker();
    this.autorun(() => {
        const data = Template.currentData();
        if( data === Object( data )){
            Template.date_select.fn.setDate( '', data.date );
        }
    });
});

Template.date_select.events({
    'change .js-date-select input'( event, instance ){
        instance.$('.js-date-select').trigger('date_select-change');
    }
});
