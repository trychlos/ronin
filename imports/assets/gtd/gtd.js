/*
 * GettingThingsDone (C) by ThinkingRock features
 *  gtdFeatures() globally defines the menu and the options.
 *
 *  Each item has:
 *  - id: a unique identifier
 *  - label: as the name says
 *  - sublabel (maybe): a secondary label, whose display depends of the currently
 *      running menu
 *  - route (maybe): the router entry if this is an actionable item
 *
 *  + the item may have zero to several entries for each menu display:
 *    > navs
 *          footer
 *          header
 *          overview
 *          side
 *    > tabs
 *          actions
 *          projects
 *          setup
 *  where each entry may have following keys:
 *    - display (maybe): whether the idem is displayed in this menu, defaulting to false
 *    - label (maybe): overrides the item label for this menu display
 *    - sort (maybe): the sort-order of this level of items, defaulting to 0
 *
 *  + the item may have children items.
 *
 *  NB: see https://stackoverflow.com/questions/33611812/export-const-vs-export-default-in-es6
 */
export const gtd = {
    features: function(){
        return [
            {
                id: 'home',
                label: 'Home',
                route: 'home',
                navs: {
                    header: {
                        display: true
                    },
                    side: {
                        display: true,
                        label: 'Overview'
                    }
                }
            },
            {
                id: 'setup',
                label: 'Setup',
                route: 'setup',
                navs: {
                    footer: {
                        display: true,
                        sort: 1
                    },
                    overview: {
                        display: true
                    },
                    side: {
                        display: true
                    }
                },
                children: [
                    /* this item for the sake of completeness as it is not used here */
                    {
                        label: 'Create data file',
                    },
                    {
                        id: 'contexts',
                        label: 'Contexts',
                        route: 'setup.contexts',
                        navs: {
                            header: {
                                display: true
                            },
                            overview: {
                                display: true
                            },
                            side: {
                                display: true,
                                label: 'Setup contexts'
                            }
                        },
                        tabs: {
                            setup: {
                                display: true
                            }
                        }
                    },
                    /* this item for the sake of completeness as it is not used here */
                    {
                        label: 'Setup criteria',
                    },
                    {
                        id: 'time',
                        label: 'Time values',
                        route: 'setup.time',
                        navs: {
                            header: {
                                display: true
                            },
                            side: {
                                display: true,
                                label: 'Setup time values'
                            }
                        },
                        tabs: {
                            setup: {
                                display: true
                            }
                        }
                    },
                    {
                        id: 'energy',
                        label: 'Energy values',
                        route: 'setup.energy',
                        navs: {
                            header: {
                                display: true
                            },
                            side: {
                                display: true,
                                label: 'Setup energy values'
                            }
                        },
                        tabs: {
                            setup: {
                                display: true
                            }
                        }
                    },
                    {
                        id: 'priority',
                        label: 'Priority values',
                        route: 'setup.priority',
                        navs: {
                            header: {
                                display: true
                            },
                            side: {
                                display: true,
                                label: 'Setup priority values'
                            }
                        },
                        tabs: {
                            setup: {
                                display: true
                            }
                        }
                    },
                    {
                        id: 'topics',
                        label: 'Topics',
                        route: 'setup.topics',
                        navs: {
                            header: {
                                display: true
                            },
                            overview: {
                                display: true
                            },
                            side: {
                                display: true,
                                label: 'Setup topics'
                            }
                        },
                        tabs: {
                            setup: {
                                display: true
                            }
                        }
                    },
                    {
                        id: 'refs',
                        label: 'Reference items',
                        route: 'setup.ref',
                        navs: {
                            header: {
                                display: true
                            },
                            overview: {
                                display: true
                            },
                            side: {
                                display: true,
                                label: 'Setup reference items'
                            }
                        },
                        tabs: {
                            setup: {
                                display: true
                            }
                        }
                    },
                    {
                        id: 'delegates',
                        label: 'Delegates',
                        route: 'setup.delegates',
                        navs: {
                            header: {
                                display: true
                            },
                            overview: {
                                display: true
                            },
                            side: {
                                display: true,
                                label: 'Setup delegates'
                            }
                        },
                        tabs: {
                            setup: {
                                display: true
                            }
                        }
                    },
                ],
            },
            {
                id: 'collect',
                label: 'Collect',
                route: 'collect',
                navs: {
                    header: {
                        display: true
                    },
                    footer: {
                        display: true,
                        label: 'Thoughts',
                        sort: 2
                    },
                    overview: {
                        display: true,
                        sublabel: 'Get things off your mind'
                    },
                    side: {
                        display: true,
                        label: 'Collect thoughts'
                    }
                }
            },
            {
                id: 'process',
                label: 'Process thoughts',
                route: 'process.thoughts',
                navs: {
                    header: {
                        display: true,
                        label: 'Process'
                    },
                    overview: {
                        display: true,
                        sublabel: 'What is it? Is it actionable?'
                    },
                    side: {
                        display: true
                    }
                },
                children: [
                    {
                        id: 'maybe',
                        label: 'Someday / Maybe',
                        navs: {
                            header: {
                                display: true
                            },
                            overview: {
                                display: true
                            },
                            side: {
                                display: true
                            }
                        }
                    },
                    {
                        id: 'new.project',
                        label: 'New project',
                        route: 'process.project.new',
                        navs: {
                            side: {
                                display: true
                            }
                        }
                    },
                    {
                        id: 'new.action',
                        label: 'New action',
                        route: 'process.action.new',
                        navs: {
                            side: {
                                display: true
                            }
                        }
                    },
                ],
            },
            {
                id: 'review',
                label: 'Review',
                route: 'review',
                sublabel: [
                    'Organize',
                    'Do'
                ],
                navs: {
                    overview: {
                        display: true
                    },
                    side: {
                        display: true
                    }
                },
                children: [
                    {
                        id: 'projects',
                        label: 'Projects',
                        route: 'review.projects',
                        navs: {
                            header: {
                                display: true
                            },
                            footer: {
                                display: true,
                                sort: 4
                            },
                            overview: {
                                display: true
                            },
                            side: {
                                display: true
                            }
                        },
                        tabs: {
                            projects: {
                                display: true,
                                sort: 1
                            }
                        }
                    },
                    {
                        id: 'future',
                        label: 'Future projects',
                        route: 'review.future',
                        navs: {
                            header: {
                                display: true
                            },
                            overview: {
                                display: true
                            },
                            side: {
                                display: true
                            }
                        },
                        tabs: {
                            projects: {
                                display: true,
                                sort: 3
                            }
                        }
                    },
                    {
                        id: 'actions',
                        label: 'Actions',
                        route: 'review.actions',
                        navs: {
                            footer: {
                                display: true,
                                sort: 3
                            },
                            header: {
                                display: true
                            },
                            overview: {
                                display: true
                            },
                            side: {
                                display: true
                            }
                        },
                        tabs: {
                            projects: {
                                display: true,
                                label: 'Single actions',
                                sort: 2
                            }
                        }
                    },
                    {
                        id: 'inactive',
                        label: 'Inactive',
                        route: 'review.inactive',
                        navs: {
                            header: {
                                display: true
                            },
                            overview: {
                                display: true
                            },
                            side: {
                                display: true
                            }
                        },
                        tabs: {
                            actions: {
                                display: true
                            }
                        }
                    },
                    {
                        id: 'asap',
                        label: 'Do ASAP',
                        route: 'review.asap',
                        navs: {
                            header: {
                                display: true
                            },
                            overview: {
                                display: true
                            },
                            side: {
                                display: true
                            }
                        },
                        tabs: {
                            actions: {
                                display: true
                            }
                        }
                    },
                    {
                        id: 'scheduled',
                        label: 'Scheduled',
                        route: 'review.scheduled',
                        navs: {
                            header: {
                                display: true
                            },
                            overview: {
                                display: true
                            },
                            side: {
                                display: true
                            }
                        },
                        tabs: {
                            actions: {
                                display: true
                            }
                        }
                    },
                    {
                        id: 'delegated',
                        label: 'Delegated',
                        route: 'review.delegated',
                        navs: {
                            header: {
                                display: true
                            },
                            overview: {
                                display: true
                            },
                            side: {
                                display: true
                            }
                        },
                        tabs: {
                            actions: {
                                display: true
                            }
                        }
                    },
                    {
                        id: 'done',
                        label: 'Done',
                        route: 'review.done',
                        navs: {
                            header: {
                                display: true
                            },
                            overview: {
                                display: true
                            },
                            side: {
                                display: true
                            }
                        },
                        tabs: {
                            actions: {
                                display: true
                            }
                        }
                    }
                ]
            }
        ];
    },
    // return the list of items to be managed as a tabbed page in actions window
    //  these are marked as tabactions:true
    actionsItems(){
        return gtd.itemsBoolArray( 'tabactions' );
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
        return ( type === 'navside' && item.longer ) ? item.longer : item.label;
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
    // return the label to be used for a tab
    labelTab: function( item ){
        return item.tabtitle ? item.tabtitle : item.label;
    },
    // return the list of items to be managed as a tabbed page in mobile layout
    //  these are marked as navtouch:true
    touchItems(){
        return gtd.itemsBoolArray( 'navtouch' ).sort( gtd._touchItems_sort );
    },
    _touchItems_sort( a, b ){
        return a.touchsort < b.touchsort ? -1 : ( a.touchsort > b.touchsort ? 1 : 0 );
    },
    touchLabel: function( item ){
        return item.touchlabel ? item.touchlabel : item.label;
    },
    // return the list of items to be managed as a tabbed page in projects window
    //  these are marked as tabprojects:true
    projectsItems(){
        return gtd.itemsBoolArray( 'tabprojects' ).sort( gtd._projectsItems_sort );
    },
    _projectsItems_sort( a, b ){
        return a.tabsort < b.tabsort ? -1 : ( a.tabsort > b.tabsort ? 1 : 0 );
    },
    // return the list of items to be managed as a tabbed page in 'setup' window
    //  these are marked as tabsetup:true
    setupItems(){
        return gtd.itemsBoolArray( 'tabsetup' );
    },
};
