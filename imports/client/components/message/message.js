/*
 *  Local (client only) Messages collection.
 */
import './message.html';

Messages = new Mongo.Collection( null );

// type: a language-agnostic error code
//       this may be catched by the code
// message: the message to be displayed to the user
messageError = function( o ){
    Messages.insert({
        type: o.type,
        message: o.message
    })
};

messageSuccess = function( m ){
    Messages.insert({
        type: 'success',
        message: m
    })
};

// general message
messageWarning = function( m ){
    Messages.insert({
        type: 'warning',
        message: m
    })
};

Template.message.helpers({
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
