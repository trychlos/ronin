/*
 * ronin-core-ui package
 *  action/constants.js
 */

// the permissions managed in an environment basis, on settings.public
R_ACT_DELETE    = 'delete';
R_ACT_EDIT      = 'edit';
R_ACT_NEW       = 'new';

_arrayActions = null;

// a list of permissions managed throught the environment-based Meteor.settings
Ronin.managedActions = {
    new: {
        label: 'New'
    },
    edit: {
        label: 'Edit'
    },
    delete: {
        label: 'Delete'

    }
};
