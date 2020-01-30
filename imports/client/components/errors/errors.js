// Local (client only) Errors collection

import './errors.html';

Errors = new Mongo.Collection( null );

// type: a language-agnostic error code
//       this may be catched by the code
// message: the message to be displayed to the user
throwError = function( o ){
    Errors.insert({
        type: o.type,
        message: o.message
    })
};

Template.errors.helpers({
    errors: function(){
        return Errors.find();
    }
});

Template.error.onRendered( function(){
    var error = this.data;
    Meteor.setTimeout( function(){
        Errors.remove( error._id );
    }, 3000 );
});
