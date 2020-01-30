/*
 *  Local (client only) Messages collection.
 */
import './message.html';

Messages = new Mongo.Collection( null );

// type: a language-agnostic error code
//       this may be catched by the code
// message: the message to be displayed to the user
throwError = function( o ){
    Messages.insert({
        type: o.type,
        message: o.message
    })
};

throwSuccess = function( m ){
    Messages.insert({
        type: 'success',
        message: m
    })
};

// general message
throwMessage = function( o ){
    Messages.insert({
        type: o.type,
        message: m
    })
};

Template.messageTmpl.helpers({
    messages: function(){
        return Messages.find();
    }
});

Template.msgTmpl.helpers({
    msgClass: function( it ){
        return it.type === 'success' ? 'alert-success' :
            ( it.type === 'warning' ? 'alert-warning' : 'alert-danger' );
    },
    msgText: function( it ){
        return it.message;
    }
});

Template.msgTmpl.onRendered( function(){
    var msg = this.data.msg;
    Meteor.setTimeout( function(){
        Messages.remove( msg._id );
    }, 3000 );
});
