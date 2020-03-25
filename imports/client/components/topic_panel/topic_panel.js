/*
 * 'topic_panel' component.
 *
 *  Let the user edit a topic:
 *  - create a new topic
 *  - edit an existing topic.
 *
 *  Parameters:
 *  - item: the item to be edited, may be null.
 */
import { Topics } from '/imports/api/collections/topics/topics.js';
import './topic_panel.html';

Template.topic_panel.fn = {
    getContent: function( $dom ){
        const fn = Template.topic_panel.fn;
        let o = null;
        if( $dom ){
            o = {
                name: $( $dom.find( '.js-name' )[0] ).val(),
                description: $( $dom.find( '.js-description' )[0] ).val(),
                textColor: fn.getTextColorSelection( $dom ),
                backgroundColor: fn.getBackgroundColorSelection( $dom )
            };
        }
        return o;
    },
    initEditArea: function( $dom ){
        if( $dom ){
            $( $dom.find('.js-name')[0] ).val('');
            $( $dom.find( '.js-description' )[0] ).val('');
            Template.topic_panel.fn.setNameTextDefault( $dom );
            Template.topic_panel.fn.setNameBackgroundDefault( $dom );
        }
    },
    // after a color change, set the background color of the edition area
    changeBackgroundColor: function( $dom ){
        const fn = Template.topic_panel.fn;
        fn.setNameBackgroundColor( $dom, fn.getBackgroundColorSelection( $dom ));
    },
    getBackgroundColorSelection: function( $dom ){
        return $( $dom.find( '.js-backcolor' )[0] ).spectrum( 'get' ).toHexString();
    },
    setNameBackgroundColor: function( $dom, color ){
        $( $dom.find( '.js-name' )[0] ).css({ 'background-color':color });
    },
    setNameBackgroundDefault: function( $dom ){
        $( $dom.find( '.js-backcolor' )[0] ).spectrum( 'set', Topics.fn.colorBackground );
        Template.topic_panel.fn.changeBackgroundColor( $dom );
    },
    // after a color change, set the text color of the edition area
    changeTextColor: function( $dom ){
        const fn = Template.topic_panel.fn;
        fn.setNameTextColor( $dom, fn.getTextColorSelection( $dom ));
    },
    getTextColorSelection: function( $dom ){
        return $( $dom.find( '.js-textcolor' )[0] ).spectrum( 'get' ).toHexString();
    },
    setNameTextColor: function( $dom, color ){
        $( $dom.find( '.js-name' )[0] ).css({ 'color':color });
    },
    setNameTextDefault: function( $dom ){
        $( $dom.find( '.js-textcolor' )[0] ).spectrum( 'set', Topics.fn.colorText );
        Template.topic_panel.fn.changeTextColor( $dom );
    }
};

Template.topic_panel.onRendered( function(){
    //console.log( 'topic_panel.onRendered' );
    const $dom = this.$( '.topic-panel' );
    const fn = Template.topic_panel.fn;

    // initialize text color selection
    // during an update (the session holds a topic object), all the UI
    //  will be dynamically updated
    // contrarily, when entering a new topic, we have to update the UI ourselves
    let color;

    // initialize text color selection
    color = miscSpectrum();
    color.change = function(){
        fn.changeTextColor( $dom )
    };
    $( $dom.find( '.js-textcolor' )[0] ).spectrum( color );

    // initialize background color selection
    color = miscSpectrum();
    color.change = function(){
        fn.changeBackgroundColor( $dom )
    };
    $( $dom.find( '.js-backcolor' )[0] ).spectrum( color );

    this.autorun(() => {
        const data = Template.currentData();
        if( data.item && data.item.textColor ){
            $( $dom.find( '.js-textcolor' )[0] ).spectrum( 'set', data.item.textColor );
            fn.changeTextColor( $dom );
        } else {
            fn.setNameTextDefault( $dom );
        }
    });

    this.autorun(() => {
        const data = Template.currentData();
        if( data.item && data.item.backgroundColor ){
            $( $dom.find( '.js-backcolor' )[0] ).spectrum( 'set', data.item.backgroundColor );
            fn.changeBackgroundColor( $dom );
        } else {
            fn.setNameBackgroundDefault( $dom );
        }
    });
});

Template.topic_panel.helpers({
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
