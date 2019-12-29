import SimpleSchema from 'simpl-schema';

// Configure behaviour globally
// All collection using this behaviour will use these settings as defaults
// The settings below are the package default settings
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
