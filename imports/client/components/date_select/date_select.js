/*
 * 'date_select' component.
 *  Let the user select a date.
 *
 *  Parameters:
 *  - date: date to be set (default is none).
 */
import { Meteor } from 'meteor/meteor';
import './date_select.html';

Template.date_select.fn = {
    // return the currently selected date in ISO format
    //  e.g. 'Sun Dec 22 2019 00:00:00 GMT+0100 (Central European Standard Time)'
    clearDate: function( $parent ){
        $( $parent.find( '.js-date-select input' )[0] ).val('');
    },
    // return the currently selected date in ISO format
    //  e.g. 'Sun Dec 22 2019 00:00:00 GMT+0100 (Central European Standard Time)'
    getDate: function( $parent ){
        return $( $parent.find( '.js-date-select input' )[0] ).datepicker( 'getDate' );
    },
    // set the default date
    //  converting ISO to our display format
    //  NB: for historical reasons, date may be a string (ISO format) instead of a Date
    //      but jQuery.datepicker doesn't well handle correctly strings
    //      so force a Date conversion
    //  See: ( Object.prototype.toString.call(d) === "[object Date]" && !isNaN(d.getTime())) aka isDate()
    setDate: function( $parent, date ){
        const d = date ? new Date( date ) : null;
        $( $parent.find( '.js-date-select input' )[0] ).datepicker( 'setDate', d );
    },
    // set an option
    setOption: function( $parent, name, value ){
        $( $parent.find( '.js-date-select input' )[0] ).datepicker('option', name, value);
    }
};

Template.date_select.onRendered( function(){
    const $picker = this.$(' .js-date-select input');
    $picker.datepicker();

    this.autorun(() => {
        const data = Template.currentData();
        if( data && data.date ){
            $picker.datepicker( 'setDate', new Date( data.date ));
        }
    });
});

Template.date_select.events({
    'change .js-date-select input'( event, instance ){
        instance.$('.js-date-select').trigger('date_select-change');
    }
});
