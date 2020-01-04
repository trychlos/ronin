/*
 * GettingThingsDone (C) by ThinkingRock features
 *  gtdFeatures() globally defines the menu and the options.
 *  Each item has:
 *  - id: a unique identifier
 *  - label: a rather short label suitable for horizontal menu
 *  - longer (maybe): a secondary label suitable for a vertical menu, defaults to 'label'
 *  - router (maybe): the router entry if this is an actionable item
 *  - children (maybe): one or more child items
 *  Type may be :
 *  - 'side' : concerns the menu of the left side of the page
 *  - 'bar' : concerns the menu bar of the top side of the page
 *  - 'view' : concerns the overview
 */
export const gtd = {
    features: function(){
        return [
            {
                id: 'home',
                label: 'Home',
                longer: 'Overview',
                view: false,
                router: 'home'
            },
            {
                id: 'setup',
                label: 'Setup',
                bar: false,
                children: [
                    /* this item for the sake of completeness as it is not used in our web version */
                    {
                        id: 'dat',
                        label: 'Create data file',
                        qualifier: 'disabled',
                        view: false,
                        side: false,
                        bar: false,
                        setup: false
                    },
                    {
                        id: 'contexts',
                        label: 'Contexts',
                        longer: 'Setup contexts',
                        router: 'setup.contexts',
                    },
                    {
                        id: 'cri',
                        label: 'Setup criteria',
                        router: 'App.setup.cri',
                        side: false,
                        bar: false,
                        setup: false
                    },
                    {
                        id: 'time',
                        label: 'Time values',
                        longer: 'Setup time values',
                        router: 'setup.time.values',
                        view: false
                    },
                    {
                        id: 'energy',
                        label: 'Energy values',
                        longer: 'Setup energy values',
                        router: 'setup.energy.values',
                        view: false
                    },
                    {
                        id: 'priority',
                        label: 'Priority values',
                        longer: 'Setup priority values',
                        router: 'setup.priority.values',
                        view: false
                    },
                    {
                        id: 'status',
                        label: 'Action status',
                        longer: 'Setup action status',
                        router: 'setup.action.status',
                        view: false
                    },
                    {
                        id: 'topics',
                        label: 'Topics',
                        longer: 'Setup topics',
                        router: 'setup.topics'
                    },
                    {
                        id: 'refs',
                        label: 'Reference items',
                        longer: 'Setup reference items',
                        router: 'setup.ref.items'
                    },
                    {
                        id: 'delegates',
                        label: 'Delegates',
                        longer: 'Setup delegates',
                        router: 'setup.delegates'
                    },
                ],
            },
            {
                id: 'collect',
                label: 'Collect',
                h3: 'Get things off your mind',
                bar: false,
                children: [
                    {
                        id: 'col',
                        label: 'Collect thoughts',
                        router: 'collect.thoughts'
                    }
                ],
            },
            {
                id: 'process',
                label: 'Process',
                h3: 'What is it? Is it actionable?',
                bar: false,
                children: [
                    {
                        id: 'pro',
                        label: 'Process thoughts',
                        router: 'process.thoughts'
                    },
                    {
                        id: 'may',
                        label: 'Someday / Maybe'
                    },
                    {
                        id: 'nep',
                        label: 'New project',
                        router: 'process.new.project'
                    },
                    {
                        id: 'nea',
                        label: 'New action',
                        router: 'process.new.action'
                    },
                ],
            },
            {
                id: 'review',
                label: 'Review',
                h3: [
                    'Organize',
                    'Do'
                ],
                bar: false,
                children: [
                    {
                        id: 'projects',
                        label: 'Projects',
                        router: 'review.projects'
                    },
                    {
                        id: 'future',
                        label: 'Future projects',
                        router: 'review.future'
                    },
                    {
                        id: 'actions',
                        label: 'Actions',
                        router: 'review.actions'
                    },
                    {
                        id: 'ina',
                        label: 'Inactive',
                        router: 'review.inactive'
                    },
                    {
                        id: 'asa',
                        label: 'Do ASAP',
                        router: 'review.asap'
                    },
                    {
                        id: 'sch',
                        label: 'Scheduled',
                        router: 'review.scheduled'
                    },
                    {
                        id: 'del',
                        label: 'Delegated',
                        router: 'review.delegated'
                    },
                    {
                        id: 'don',
                        label: 'Done',
                        router: 'review.done'
                    }
                ]
            }
        ];
    },
    byId: function( id ){
        return gtd._byId_rec( id, gtd.features());
    },
    _byId_rec: function( id, array ){
        for( var i=0 ; i<array.length ; ++i ){
            const item = array[i];
            if( item.id === id ){
                return item;
            }
            if( gtd.hasChildren( item )){
                let ret = gtd._byId_rec( id, item.children );
                if( ret ){
                    return ret;
                }
            }
        }
        return null;
    },
    classes: function( type, item ){
        //console.log( 'classes: type='+type+' item='+JSON.stringify( item ));
        classes = [];
        if( item.qualifier === 'disabled' ){
            classes.push('disabled-item');
        }
        if( gtd.hasChildren( item )){
            classes.push('header-item');
        }
        return classes;
    },
    hasChildren: function( item ){
        return item.children && item.children.length > 0 ;
    },
    isEnabled: function( type, item ){
        return item[type] === undefined ? true : item[type];
    },
    isVisible: function( type, item ){
        return item[type] === undefined ? true : item[type];
    },
    label: function( type, item ){
        return ( type === 'side' && item.longer ) ? item.longer : item.label;
    },
    labelById: function( type, id ){
        let label = '';
        if( id ){
            const item = gtd.byId( id );
            if( item ){
                label = gtd.label( type, item );
            }
        }
        return label;
    },
    setupItems(){
        const setup = gtd.byId('setup').children;
        var items = [];
        for( var i=0 ; i<setup.length ; ++i ){
            if( gtd.isVisible( 'setup', setup[i] )){
                items.push( setup[i] );
            }
        }
        return items;
    },
};
