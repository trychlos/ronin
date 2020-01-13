/*
 * Actions status.
 *
 *  Each item has:
 *  - id: a unique identifier
 *  - label: a rather short label suitable for tabs display
 *  - actionable: defaulting to false
 *
 *  Have a special display:
 *  - actionable actions in projects review
 *  - done actions in projects review
 *
 *  NB: see https://stackoverflow.com/questions/33611812/export-const-vs-export-default-in-es6
 */
export const actionStatus = {
    all: function(){
        return [
            {
                id: 'ina',
                label: 'Inactive'
            },
            {
                id: 'asa',
                label: 'Do ASAP',
                actionable: true
            },
            {
                id: 'sch',
                label: 'Scheduled',
                actionable: true
            },
            {
                id: 'del',
                label: 'Delegated',
                actionable: true
            },
            {
                id: 'wai',
                label: 'Waiting'
            },
            {
                id: 'don',
                label: 'Done'
            }
        ];
    },
    // whether this status qualifies an actionable action
    isActionable: function( item ){
        return item.id == 'don';
    },
    // whether this status qualifies a terminated action
    isDone: function( item ){
        return item.id == 'don';
    }
};
