/*
 * GettingThingsDone (C) by ThinkingRock features
 *  gtdFeatures() globally defines the menu and the options.
 *
 *  Each item has:
 *  - id: a unique identifier
 *  - label: a rather short label suitable for horizontal menu
 *  - longer (maybe): a secondary label suitable for a vertical menu, defaults to 'label'
 *  - router (maybe): the router entry if this is an actionable item
 *  - children (maybe): one or more child items
 *  +
 *  - 'bar': concerns the menu bar of the top side of the page, defaulting to false
 *  - 'side': concerns the menu of the left side of the page, defaulting to false
 *  - 'view': concerns the overview, defaulting to false
 *  +
 *  - 'actions': whether the item is managed by the 'actions' tabbed window, defaulting to false
 *  - 'setup': whether the item is managed by the 'setup' tabbed window, defaulting to false
 *
 *  NB: see https://stackoverflow.com/questions/33611812/export-const-vs-export-default-in-es6
 */
export const gtd = {
    features: function(){
        return [
            {
                id: 'home',
                label: 'Home',
                longer: 'Overview',
                router: 'home',
                bar: true,
                side: true
            },
            {
                id: 'setup',
                label: 'Setup',
                side: true,
                view: true,
                children: [
                    /* this item for the sake of completeness as it is not used in our web version */
                    {
                        id: 'dat',
                        label: 'Create data file',
                        qualifier: 'disabled'
                    },
                    {
                        id: 'contexts',
                        label: 'Contexts',
                        longer: 'Setup contexts',
                        router: 'setup.contexts',
                        bar: true,
                        side: true,
                        view: true,
                        setup: true
                    },
                    {
                        id: 'cri',
                        label: 'Setup criteria',
                        //router: 'App.setup.cri',
                        view: true
                    },
                    {
                        id: 'time',
                        label: 'Time values',
                        longer: 'Setup time values',
                        router: 'setup.time.values',
                        bar: true,
                        side: true,
                        setup: true
                    },
                    {
                        id: 'energy',
                        label: 'Energy values',
                        longer: 'Setup energy values',
                        router: 'setup.energy.values',
                        bar: true,
                        side: true,
                        setup: true
                    },
                    {
                        id: 'priority',
                        label: 'Priority values',
                        longer: 'Setup priority values',
                        router: 'setup.priority.values',
                        bar: true,
                        side: true,
                        setup: true
                    },
                    {
                        id: 'status',
                        label: 'Action status',
                        longer: 'Setup action status',
                        router: 'setup.action.status',
                        bar: true,
                        side: true,
                        setup: true
                    },
                    {
                        id: 'topics',
                        label: 'Topics',
                        longer: 'Setup topics',
                        router: 'setup.topics',
                        bar: true,
                        side: true,
                        view: true,
                        setup: true
                    },
                    {
                        id: 'refs',
                        label: 'Reference items',
                        longer: 'Setup reference items',
                        router: 'setup.ref.items',
                        bar: true,
                        side: true,
                        view: true,
                        setup: true
                    },
                    {
                        id: 'delegates',
                        label: 'Delegates',
                        longer: 'Setup delegates',
                        router: 'setup.delegates',
                        bar: true,
                        side: true,
                        view: true,
                        setup: true
                    },
                ],
            },
            {
                id: 'collect',
                label: 'Collect',
                h3: 'Get things off your mind',
                side: true,
                view: true,
                children: [
                    {
                        id: 'col',
                        label: 'Collect thoughts',
                        router: 'collect.thoughts',
                        bar: true,
                        side: true,
                        view: true
                    }
                ],
            },
            {
                id: 'process',
                label: 'Process',
                h3: 'What is it? Is it actionable?',
                side: true,
                view: true,
                children: [
                    {
                        id: 'pro',
                        label: 'Process thoughts',
                        router: 'process.thoughts',
                        bar: true,
                        side: true,
                        view: true
                    },
                    {
                        id: 'may',
                        label: 'Someday / Maybe',
                        bar: true,
                        side: true,
                        view: true
                    },
                    {
                        id: 'nep',
                        label: 'New project',
                        router: 'process.new.project',
                        bar: true,
                        side: true,
                        view: true
                    },
                    {
                        id: 'nea',
                        label: 'New action',
                        router: 'process.new.action',
                        bar: true,
                        side: true,
                        view: true
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
                side: true,
                view: true,
                children: [
                    {
                        id: 'projects',
                        label: 'Projects',
                        router: 'review.projects',
                        bar: true,
                        side: true,
                        view: true
                    },
                    {
                        id: 'future',
                        label: 'Future projects',
                        router: 'review.future',
                        bar: true,
                        side: true,
                        view: true
                    },
                    {
                        id: 'actions',
                        label: 'Actions',
                        router: 'review.actions',
                        bar: true,
                        side: true,
                        view: true
                    },
                    {
                        id: 'ina',
                        label: 'Inactive',
                        router: 'review.inactive',
                        bar: true,
                        side: true,
                        view: true,
                        actions: true
                    },
                    {
                        id: 'asa',
                        label: 'Do ASAP',
                        router: 'review.asap',
                        bar: true,
                        side: true,
                        view: true,
                        actions: true
                    },
                    {
                        id: 'sch',
                        label: 'Scheduled',
                        router: 'review.scheduled',
                        bar: true,
                        side: true,
                        view: true,
                        actions: true
                    },
                    {
                        id: 'del',
                        label: 'Delegated',
                        router: 'review.delegated',
                        bar: true,
                        side: true,
                        view: true,
                        actions: true
                    },
                    {
                        id: 'don',
                        label: 'Done',
                        router: 'review.done',
                        bar: true,
                        side: true,
                        view: true,
                        actions: true
                    }
                ]
            }
        ];
    },
    // return the list of items to be managed as a tabbed page in actions window
    actionsItems(){
        return gtd.itemsBoolArray( 'actions' );
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
    // provides the CSS classes to be set for this item in a menu
    classes: function( item, type ){
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
    // whether this item is displayed in this type of menu
    isVisible: function( item, type ){
        return item[type] !== undefined && item[type] === true;
    },
    // returns an array of the items for which specified bool qualifier is set to true
    itemsBoolArray: function( qualifier ){
        let result = new Array();
        return gtd._itemsBoolArray_rec( result, qualifier, gtd.features());
    },
    _itemsBoolArray_rec: function( res, qualifier, array ){
        for( let i=0 ; i<array.length ; ++i ){
            const item = array[i];
            //console.log( qualifier+': '+item.label+' visible='+gtd.isVisible( item, qualifier ));
            if( gtd.isVisible( item, qualifier )){
                res.push( item );
            }
            if( gtd.hasChildren( item )){
                gtd._itemsBoolArray_rec( res, qualifier, item.children )
            }
        }
        return res;
    },
    // returns the label to be used for this type of menu
    label: function( item, type ){
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
    // return the list of items to be managed as a tabbed page in 'setup' window
    //  these are marked as setup:true
    setupItems(){
        return gtd.itemsBoolArray( 'setup' );
    },
};
