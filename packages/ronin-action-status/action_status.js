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
export const ActionStatus = {
    all: function(){
        return [
            {
                id: 'ina',
                label: 'Inactive',
                default: true
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
    // returns the item for this id
    byId: function( id ){
        const all = ActionStatus.all();
        for( let i=0 ; i<all.length ; ++i ){
            if( all[i].id === id ){
                return all[i];
            }
        }
        console.log( 'ActionStatus='+id+' not found' );
        return null;
    },
    // returns the default action status
    getDefault: function(){
        return 'ina';
    },
    // returns the array of valid status
    getValid: function(){
        const valid = [];
        ActionStatus.all().forEach(( it ) => {
            valid.push( it.id );
        })
        return valid;
    },
    // whether this status qualifies an actionable action
    isActionable: function( id ){
        const item = ActionStatus.byId( id );
        return item ? item.actionable === true : false;
    },
    // whether the action is done
    isDone: function( id ){
        return id === 'don';
    },
    // whether this status is valid
    isValid: function( id ){
        return ActionStatus.byId( id ) != null;
    },
    labelById: function( id ){
        const item = ActionStatus.byId( id );
        return item ? item.label : '';
    }
};
