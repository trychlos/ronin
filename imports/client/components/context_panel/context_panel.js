/*
 * 'context_panel' component.
 *
 *  Let the user edit a context:
 *  - create a new context
 *  - edit an existing context.
 *
 *  Parameters:
 *  - item: the item to be edited, may be null.
 */
import './context_panel.html';

Template.context_panel.fn = {
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
    initEditArea: function( $dom ){
        if( $dom ){
            $( $dom.find('.js-name')[0] ).val('');
            $( $dom.find( '.js-description' )[0] ).val('');
        }
    }
};

Template.context_panel.helpers({
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
