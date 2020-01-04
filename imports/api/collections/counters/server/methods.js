import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Counters } from '../counters.js';

Meteor.methods({
    'counters.getNext'( name ){
        check( name, String );
        var o = Counters.findOne({ name:name });
        // the record exists (usual case)
        if( o ){
            o.nid += 1;
            Counters.update( o._id, { $set: {
                nid: o.nid
            }});
            return o.nid;
        }
        // record does not yet exist - create it
        Counters.insert({
            name: name,
            nid: 1
        });
        return 1;
    },
    'counters.getValue'( name ){
        check( name, String );
        const o = Counters.findOne({ name:name });
        return o ? o.value : null;
    },
    'counters.setValue'( name, value ){
        check( name, String );
        return Counters.update({ name: name }, { $set: { value: value }}, { upsert: true });
    }
});
