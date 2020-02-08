import { Accounts } from 'meteor/accounts-base';

Accounts.emailTemplates.from = "Ronin Passwords Manager <noreply@ronin.trychlos.org>";

// Ensuring every user has an email address, should be in server-side code
Accounts.validateNewUser(( user ) => {
    new SimpleSchema({
        _id: { type: String },
        emails: { type: Array },
        'emails.$': { type: Object },
        'emails.$.address': { type: String },
        'emails.$.verified': { type: Boolean },
        createdAt: { type: Date },
        services: { type: Object, blackbox: true }
    }).validate( user );

    // Return true to allow user creation to proceed
    return true;
});
