/*
 * 'time_value_edit' component.
 *  Let the user
 *  - enter a new time value (session/setup.time_values.obj empty)
 *  - or edit an existing one (session/setup.time_values.obj already exists).
 *
 *  Session variables:
 *  - 'setup.time_values.obj': the edited object, selected in time_values_list.
 */
import './time_value_panel.html';

Template.time_value_panel.fn = {
    getContent: function( $dom ){
        let o = null;
        if( $dom ){
            o = {
                name: $( $dom.find( '.js-name' )[0] ).val(),
                description: $( $dom.find( '.js-description' )[0] ).val(),
            };
        }
        return o;
    },
    // initialize the edition area
    // this is needed when we cancel a current creation
    //  as this will not change the setup.topics.obj session variable
    //  no helper is triggered,
    //  and we have to manually reinit the fields
    initEditArea: function( $dom ){
        if( $dom ){
            $( $dom.find('.js-name')[0] ).val('');
            $( $dom.find( '.js-description' )[0] ).val('');
        }
    }
};

Template.time_value_panel.helpers({
    valDescription(){
        return this.item ? this.item.description : '';
    },
    valId(){
        return this.item ? this.item._id : '';
    },
    valName(){
        return this.item ? this.item.name : '';
    },
    valOwner(){
        const userId = this.item ? this.item.userId : null;
        let owner = '<unowned>';
        if( userId ){
            const user = Meteor.users.findOne({ _id: userId });
            if( user ){
                owner = user.emails[0].address;
            }
        }
        return owner;
    }
});
