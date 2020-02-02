/*
 * GettingThingsDone (C) by ThinkingRock features
 *  gtdFeatures() globally defines the menu and the options.
 *
 *  Each item has:
 *  - id: a unique identifier
 *      if this identifier is left undefined, the item will be silently ignored
 *  - label: as the name says
 *  - sublabel (maybe): a secondary label, whose display depends of the currently
 *      running menu
 *  - route (maybe): the router entry name if this is an actionable item
 *      there may be zero or one route name, or a route name dependant of the
 *      running layout.
 *      NB: the same route may be triggered several times, from different places
 *      in the menus. So the route name cannot be used to identify an item.
 *      This is the item idenfier role.
 *  - group (maybe): the item identifier to which this item should be attached.
 *      As route, the group may be a single item, or layout-dependant.
 *      Defaults to the parent item identifier.
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
 *    - display (maybe): whether the idem is displayed in this menu, defaulting
 *      to false
 *      As route, the display may be a single item, or layout-dependant.
 *    - label (maybe): overrides the item label for this menu display
 *    - sort (maybe): the sort-order of this level of items, defaulting to 0
 *
 *  Please note that 'navs' and 'tabs' above are only distinguished for
 *  convenience and structure clarity. They are both treated the same way,
 *  and keys must be different (no same key in 'navs' and 'tabs').
 *
 *  + the item may have children items.
 *
 *  NB: see https://stackoverflow.com/questions/33611812/export-const-vs-export-default-in-es6
 *
 *  Session variables:
 *  - 'gtd.last': in page-based layout, we require to always have an active item
 *      in the footer navigation bar; keep here the last active GTD item identifier;
 *      defaults to 'collect'.
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
            /*
             *  Setup features group
             */
            {
                id: 'setup',
                label: 'Setup',
                navs: {
                    footer: {
                        display: true,
                        sort: 1
                    },
                    overview: {
                        route: 'setup',
                        display: true
                    },
                    side: {
                        display: true
                    }
                },
                children: [
                    {
                        label: 'Create data file',  // this item for the sake of completeness as it is not used here
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
                    {
                        label: 'Setup criteria',    // this item for the sake of completeness as it is not used here
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
            /*
             *  Collect features group
             *  Actually one single feature, at the heart of the thoughts collect
             *  NB: page-base layout groups features depending of the targeted
             *      collection; this one is labelled 'Thoughts'
             */
            {
                id: 'collect.parent',
                label: 'Collect',
                navs: {
                    side: {
                        display: true,
                    }
                },
                children: [
                    {
                        id: 'collect',
                        label: 'Collect thoughts',
                        route: 'collect',
                        navs: {
                            footer: {
                                display: true,
                                label: 'Thoughts',
                                sort: 2
                            },
                            header: {
                                display: true
                            },
                            overview: {
                                display: true,
                                sublabel: 'Get things off your mind'
                            },
                            side: {
                                display: true,
                            }
                        }
                    }
                ]
            },
            /*
             *  Process features group
             *  NB: in page-based layout, some items are attached to the collect group.
             */
            {
                id: 'process',
                label: 'Process',
                navs: {
                    header: {
                        display: true
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
                            overview: {
                                display: true
                            },
                            side: {
                                display: true
                            }
                        }
                    },
                    {
                        id: 'tho-project',
                        label: 'Transform into a project',
                        route: 'process.project',
                        group: {
                            pageLayout: 'collect'
                        }
                    },
                    {
                        id: 'project',
                        label: 'New project',
                        navs: {
                            side: {
                                display: true
                            }
                        }
                    },
                    {
                        id: 'tho-action',
                        label: 'Transform into an action',
                        route: 'process.action',
                        group: {
                            pageLayout: 'collect'
                        }
                    },
                    {
                        id: 'action',
                        label: 'New action',
                        route: 'action.new',
                        navs: {
                            side: {
                                display: true
                            }
                        }
                    }
                ]
            },
            /*
             *  Review features group
             */
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
                                display: {
                                    windowLayout: true
                                },
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
    // return the item whose id is specified
    //  return null if id is empty or not found
    _byId: function( id ){
        return id ? gtd._byId_rec( id, gtd.features()) : null;
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
    classes: function( name, item ){
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
    // returns the named sub-element from 'navs' or 'tabs' for this item, or null
    _getNavTab( name, item ){
        return item.navs && item.navs[name]
                ? item.navs[name]
                : ( item.tabs && item.tabs[name] ? item.tabs[name] : null );
    },
    hasChildren: function( item ){
        return item.children && item.children.length > 0 ;
    },
    // whether this item is displayed in the named navigation menu
    isVisible: function( name, item ){
        const sub = gtd._getNavTab( name, item );
        let display = sub && sub.display;
        if( display ){
            if( typeof sub.display === 'object' ){
                display = false;
                if( g && g.run && g.run.layout ){
                    const layout = g.run.layout.get();
                    display = sub.display[layout] || false;
                }
            }
        }
        return display;
    },
    // returns the list of items to be managed in the named navigation menu
    //  which must be be defined inside of 'navs' or 'tabs'
    // note that returned item may not have any route (should be displayed
    //  as 'disabled' if displayed at all)
    // maybe an empty array
    items( name ){
        let result = new Array();
        return gtd._items_rec( name, result, gtd.features()).sort( gtd._items_sort( name ));
    },
    _items_rec: function( name, res, inputArray ){
        for( let i=0 ; i<inputArray.length ; ++i ){
            const item = inputArray[i];
            // must have an identifier
            if( !item.id ){
                continue;
            }
            if( gtd.isVisible( name, item )){
                res.push( item );
            }
            if( gtd.hasChildren( item )){
                gtd._items_rec( name, res, item.children );
            }
        }
        return res;
    },
    _items_sort( name ){
        return function( a, b ){
            const a_sub = gtd._getNavTab( name, a );
            const a_weight = a_sub ? ( a_sub.sort || 0 ) : 0;
            const b_sub = gtd._getNavTab( name, b );
            const b_weight = b_sub ? ( b_sub.sort || 0 ) : 0;
            return a_weight < b_weight ? -1 : ( a_weight > b_weight ? 1 : 0 );
        }
    },
    // returns the label associated with this item, or with one of its parent
    // maybe an empty string
    labelItem: function( name, item ){
        return gtd._search( name, item, 'label', true );
    },
    // returns the parent of this item, or null
    _parent( item ){
        return gtd._parent_rec( item, null, gtd.features());
    },
    _parent_rec( item, candidate, inputArray ){
        if( !item.id ){
            return null;
        }
        for( let i=0 ; i<inputArray.length ; ++i ){
            const child = inputArray[i];
            // must have an identifier
            if( !child.id ){
                continue;
            }
            if( child.id === item.id ){
                return candidate;
            }
            if( gtd.hasChildren( child )){
                return gtd._parent_rec( item, child, child.children );
            }
        }
        return null;
    },
    // returns the route name associated with this item, or with one of its parent
    // maybe an empty string
    //  route should not depend of the running layout (but may depend of the current nav)
    routeId( name, id ){
        return gtd.routeItem( name, gtd._byId( id ));
    },
    routeItem( name, item ){
        return gtd._search( name, item, 'route', false );
    },
    // returns the value of the searched key
    //  which depends of the specified nav/tab
    //  which may or not depend of the current layout
    //  or null
    _search( name, item, key, layout ){
        if( !name || !item || !key ){
            return null;
        }
        //console.log( 'name='+name+' item='+item.id+' key='+key+' layout='+layout );
        const sub = gtd._getNavTab( name, item );
        if( sub && sub[key] ){
            //console.log( 'found sub[key]='+sub[key] );
            if( typeof sub[key] !== 'string' ){
                if( layout ){
                    const current = g.run.layout.get();
                    return sub[key][current];
                } else {
                    console.log( 'gtd: '+key+' is layout-dependant=false but is wrongly specified in gtd.js' );
                    return null;
                }
            }
            return sub[key];
        }
        if( item[key] ){
            return item[key];
        }
        const parent = gtd._parent( item );
        if( parent ){
            //console.log( 'found parent='+parent.id );
            return gtd._search( name, parent, key, layout );
        }
        return null;
    }
};
