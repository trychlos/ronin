/*
 * /imports/startup/both/collections-config.js
 *
 *  Collections configurations.
 */
import SimpleSchema from 'simpl-schema';

// Configure behaviour globally
// All collections using this behaviour will use these settings as defaults
// The settings below are the package default settings
// See https://github.com/zimme/meteor-collection-timestampable
//
// systemId: it's the userId to use when an update/insert/remove action is run
//  by server code that was not requested by a logged in user. e.g. if you do
//  an insert in server code when meteor starts.
//  https://github.com/zimme/meteor-collection-timestampable/issues/21
//
CollectionBehaviours.configure( 'timestampable', {
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    systemId: '0'
});

SimpleSchema.setDefaultMessages({
    messages: {
        en: {
            dupname: "The name already exists",
        },
    },
});
