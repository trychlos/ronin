import '../accounts.js';

// see https://guide.meteor.com/accounts.html#displaying-user-data
Meteor.publish( 'Meteor.ronin.users' , function({ userId }){
    // Validate the arguments to be what we expect
    new SimpleSchema({
        userId: { type: String }
    }).validate({ userId });
    // Select only the users that match the array of IDs passed in
    const selector = { _id: userId };
    // Only return these fields
    const options = {
      fields: { emails: 1 }
    };
    return Meteor.users.find( selector, options );
});
