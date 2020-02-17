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
 *  - 'gtd.page': in page-based layout, we require to always have an active item
 *      in the footer navigation bar;
 *      so keep here a GTD item identifier to which we can tie the current active item;
 *      defaults to 'thoughts-list'.
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
                id: 'setup-group',
                label: 'Setup',
                group: 'setup',
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
                    {
                        label: 'Create data file',  // this item for the sake of completeness as it is not used here
                    },
                    {
                        label: 'Setup criteria',    // this item for the sake of completeness as it is not used here
                    },
                    {
                        id: 'contexts',
                        label: 'Setup contexts',
                        route: 'setup.contexts',
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
                            setup: {
                                display: true
                            }
                        }
                    },
                    {
                        id: 'time',
                        label: 'Setup time values',
                        route: 'setup.time',
                        navs: {
                            header: {
                                display: true
                            },
                            side: {
                                display: true
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
                        label: 'Setup energy values',
                        route: 'setup.energy',
                        navs: {
                            header: {
                                display: true
                            },
                            side: {
                                display: true
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
                        label: 'Setup priority values',
                        route: 'setup.priority',
                        navs: {
                            header: {
                                display: true
                            },
                            side: {
                                display: true
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
                        label: 'Setup topics',
                        route: 'setup.topics',
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
                            setup: {
                                display: true
                            }
                        }
                    },
                    {
                        id: 'refs',
                        label: 'Setup reference items',
                        route: 'setup.ref',
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
                            setup: {
                                display: true
                            }
                        }
                    },
                    {
                        id: 'delegates',
                        label: 'Setup delegates',
                        route: 'setup.delegates',
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
                            setup: {
                                display: true
                            }
                        }
                    },
                ],
            },
            /*
             *  Collect features group.
             *  Actually one single feature, at the heart of the thoughts collect.
             *  NB.1: needs one item and one child for 'side' navigation
             *  NB.2: page-base layout groups features depending of the targeted
             *          collection; this one is labelled 'Thoughts'
             */
            {
                id: 'collect-group',
                label: 'Collect',
                group: 'collectGroup',
                navs: {
                    overview: {
                        display: true,
                        sublabel: 'Get things off your mind'
                    },
                    side: {
                        display: true,
                    }
                },
                children: [
                    {
                        id: 'thought-new',
                        label: 'Insert thoughts',
                        route: 'collect.new',
                        template: 'thoughtEdit',
                    },
                    {
                        id: 'thought-edit',
                        label: 'Edit thought',
                        route: 'collect.edit',
                        template: 'thoughtEdit',
                    },
                    {
                        id: 'thoughts-list',
                        label: 'Collect thoughts',
                        route: 'collect.list',
                        template: 'thoughtsList',
                        navs: {
                            footer: {
                                display: true,
                                label: 'Thoughts',
                                sort: 2
                            },
                            header: {
                                display: true,
                                label: 'Collect'
                            },
                            overview: {
                                display: true
                            },
                            side: {
                                display: true
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
                id: 'process-group',
                label: 'Process',
                group: 'processGroup',
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
                        id: 'process-thoughts',
                        label: 'Process thoughts',
                        navs: {
                            overview: {
                                display: true
                            }
                        }
                    },
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
                        id: 'thought-project',
                        label: 'Transform into a project',
                        route: 'process.project',
                        template: 'projectEdit',
                        group: {
                            pageLayout: 'collectGroup'
                        }
                    },
                    {
                        id: 'project-new',
                        label: 'New project',
                        navs: {
                            side: {
                                display: true
                            }
                        },
                        template: 'projectEdit',
                        route: 'project.new'
                    },
                    {
                        id: 'thought-action',
                        label: 'Transform into an action',
                        route: 'process.action',
                        template: 'actionEdit',
                        group: {
                            pageLayout: 'collectGroup'
                        }
                    },
                    {
                        id: 'action-new',
                        label: 'New action',
                        navs: {
                            side: {
                                display: true
                            }
                        },
                        template: 'actionEdit',
                        route: 'action.new'
                    }
                ]
            },
            /*
             *  Review features group
             */
            {
                id: 'review-group',
                label: 'Review',
                group: 'reviewGroup',
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
                        id: 'projects-list',
                        label: 'Projects',
                        route: 'review.projects',
                        template: 'projectsList',
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
                            },
                            window: {
                                label: 'Review projects'
                            }
                        }
                    },
                    {
                        id: 'projects-future',
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
                        id: 'actions-list',
                        label: 'Actions',
                        route: 'review.actions',
                        template: 'actionsList',
                        navs: {
                            footer: {
                                label: 'Actions',
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
                            },
                            window: {
                                label: 'Review actions'
                            }
                        }
                    },
                    {
                        id: 'actions-inactive',
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
                        id: 'actions-asap',
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
                        id: 'actions-scheduled',
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
                        id: 'actions-delegated',
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
                        id: 'actions-done',
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
                    },
                    {
                        id: 'action-edit',
                        label: 'Edit action',
                        template: 'actionEdit',
                        route: 'action.edit'
                    }
                ]
            }
        ];
    },
    // return the item whose id is specified
    //  return null if id is empty or not found
    _byId_cache: {},
    _byId: function( id ){
        if( !id ){
            return null;
        }
        if( !( id in gtd._byId_cache )){
            gtd._byId_cache[id] = gtd._byId_rec( id, gtd.features());
        }
        return gtd._byId_cache[id];
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
        if( !name || !item ){
            return null;
        }
        return item.navs && item.navs[name]
                ? item.navs[name]
                : ( item.tabs && item.tabs[name] ? item.tabs[name] : null );
    },
    // returns sublabel if it exists
    getSubLabelItem( name, item ){
        return gtd._search( name, item, 'sublabel', true );
    },
    // returns the group associated with this item
    //  group depend of the layout, but is nav agnostic
    groupId( id ){
        return gtd.groupItem( gtd._byId( id ));
    },
    groupItem( item ){
        return gtd._search( null, item, 'group', true );
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
    // returns the GTD item which exhibits this route
    itemRoute: function( route ){
        return gtd._itemRoute_rec( route, gtd.features());
    },
    _itemRoute_rec: function( route, array ){
        for( let i=0 ; i<array.length ; ++i ){
            const item = array[i];
            if( item.route === route ){
                return item;
            }
            if( gtd.hasChildren( item )){
                const it = gtd._itemRoute_rec( route, item.children );
                if( it ){
                    return it;
                }
            }
        }
        return null;
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
    labelId: function( name, id ){
        return gtd.labelItem( name, gtd._byId( id ));
    },
    labelItem: function( name, item ){
        return gtd._search( name, item, 'label', true );
    },
    // returns the parent of this item, or null
    _parent_cache: {},
    _parent( item ){
        if( !item.id ){
            return null;
        }
        if( !( item.id in gtd._parent_cache )){
            gtd._parent_cache[item.id] = gtd._parent_rec( item, null, gtd.features());
        }
        return gtd._parent_cache[item.id];
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
            //console.log( 'searching for '+item.id+' parent, examining '+child.id );
            if( child.id === item.id ){
                return candidate;
            }
            if( gtd.hasChildren( child )){
                const ret = gtd._parent_rec( item, child, child.children );
                if( ret ){
                    return  ret;
                }
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
    // if 'name' is null, then does not search in navs nor tabs
    _search( name, item, key, layout ){
        if( !item || !key ){
            return null;
        }
        let ret = null;
        //console.log( item );
        //console.log( 'name='+name+' item='+item.id+' key='+key+' layout='+layout );
        const sub = gtd._getNavTab( name, item );
        if( sub ){
            ret = gtd._search_sub( sub, key, layout );
            if( ret ){
                return ret;
            }
        }
        ret = gtd._search_sub( item, key, layout );
        if( ret ){
            return ret;
        }
        const parent = gtd._parent( item );
        if( parent ){
            //console.log( 'found parent='+parent.id );
            return gtd._search( name, parent, key, layout );
        }
        return null;
    },
    _search_sub( sub, key, layout ){
        if( !sub || !key || !sub[key] ){
            return null;
        }
        let ret = null;
        if( typeof sub[key] !== 'string' ){
            if( layout ){
                ret = sub[key][g.run.layout.get()];
            } else {
                console.log( 'gtd: '+key+' is layout-dependant=false but is wrongly specified in gtd.js' );
            }
        } else {
            ret = sub[key];
        }
        return ret;
    },
    // returns the template name associated with this item, or with one of its
    //  parent
    //  maybe an empty string
    //  template is expected to be both layout and navs/tabs agnostic
    templateId( id ){
        return gtd.templateItem( gtd._byId( id ));
    },
    templateItem( item ){
        return gtd._search( null, item, 'template', false );
    }
};
