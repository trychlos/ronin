import { Meteor } from 'meteor/meteor';
import { ActionStatus } from '../action_status.js';

Meteor.startup(() => {
    if( ActionStatus.find().count() === 0 ){
        const data = [
            { name: 'Inactive',  code: 'ina', deletable: false, activable: false, default: true },
            { name: 'Do ASAP',   code: 'asa', deletable: false },
            { name: 'Scheduled', code: 'sch', deletable: false },
            { name: 'Delegated', code: 'del', deletable: false },
            { name: 'Done',      code: 'don', deletable: false, activable: false },
        ];
        data.forEach( d => {
            ActionStatus.insert( d );
            console.log( "ActionStatus: inserting '"+d.name+"'" );
        });
    }
});
