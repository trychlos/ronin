/*
 * 'projects_tree' component.
 *  Display and manage the projects hierarchy tree.
 *  A new tree is instanciated for each tab.
 *
 *  Parameters:
 *  - label: the label to be displayed as the root node
 *  - tab: the identifier of the created instance (may not be the one currently shown).
 */
import { ActionStatus } from 'meteor/pwi:ronin-action-status';
import { Articles } from '/imports/api/collections/articles/articles.js';
import { Counters } from '/imports/api/collections/counters/counters.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import 'jqtree/tree.jquery.js';
import 'jqtree/jqtree.css';
import './projects_tree.html';

Template.projects_tree.fn = {
    // the tree is built by successive steps
    steps: {
        TREE_BUILT:     1,
        COUNTERS_GOT:   2,
        PROJECTS_SHOWN: 3,
        ACTIONS_SHOWN:  4,
        EXPANDED:       5,
        ENDED:          9
    },

    // context menu
    //  note that this context menu is not available in a touchable device
    //  so do not event try to display it
    menu_create: function( $tree, tab ){
        const fn = Template.projects_tree.fn;

        // contextual menu, delete operation
        const menu_nodeDelete = function( $tree, node ){
            if( !fn.node_isRoot( node )){
                $.pubsub.publish( 'ronin.model.item.delete', node.obj );
            }
        };
        // contextual menu, edit operation
        const menu_nodeEdit = function( $tree, node ){
            if( !fn.node_isRoot( node )){
                switch( node.obj.type ){
                    case 'A':
                        FlowRouter.go( 'rt.actions.edit', null, { id:node.obj._id });
                        break;
                    case 'P':
                        FlowRouter.go( 'rt.projects.edit', null, { id:node.obj._id });
                        break;
                }
            }
        };
        // define the context menu
        if( Ronin.ui.runLayout() === R_LYT_WINDOW ){
            $tree.contextMenu({
                selector: 'div.jqtree-element',
                build: function( elt, ev ){
                    return {
                        items: {
                            edit: {
                                name: 'Edit',
                                icon: 'fas fa-edit',
                                callback: function( item, opts, event ){
                                    const node = $( $( opts.$trigger ).parents('li')[0] ).data( 'node' );
                                    if( !fn.node_isRoot( node )){
                                        menu_nodeEdit( $tree, node );
                                    }
                                },
                                disabled: function( key, opts ){
                                    const node = $( $( this ).parents('li')[0] ).data( 'node' );
                                    return fn.node_isRoot( node );
                                }
                            },
                            delete: {
                                name: 'Delete',
                                icon: 'fas fa-trash-alt',
                                callback: function( item, opts, event ){
                                    const node = $( $( opts.$trigger ).parents('li')[0] ).data( 'node' );
                                    if( !fn.node_isRoot( node )){
                                        menu_nodeDelete( $tree, node );
                                    }
                                },
                                disabled: function( key, opts ){
                                    const node = $( $( this ).parents('li')[0] ).data( 'node' );
                                    return fn.node_isRoot( node );
                                }
                            }
                        },
                        autoHide: true,
                        events: {
                            show: function( opts ){
                                this.addClass( 'contextmenu-showing' );
                            },
                            hide: function( opts ){
                                this.removeClass( 'contextmenu-showing' );
                            }
                        },
                        position: function( opts, x, y ){
                            opts.$menu.position({
                                my: 'left top',
                                at: 'right bottom',
                                of: ev
                            });
                        }
                    }
                }
            });
        }
    },

    // returns the ad-hoc class for the item LI
    // depends of the item's type, maybe of its status
    node_getClass: function( node ){
        let classe = '';
        if( node && node.obj ){
            // by type
            const byType = {
                A: 'node-action',
                M: 'node-maybe',
                P: 'node-project',
                T: 'node-thought',
                R: 'node-root'
            };
            classe += byType[node.obj.type];
            // by status (actions only at initialization, propagated to projects)
            let byStatus = 'status-normal';
            if( node.obj.type === 'A' ){
                if( ActionStatus.isDone( node.obj.status )){
                    byStatus = 'status-done';
                } else if( ActionStatus.isActionable( node.obj.status )){
                    byStatus= 'status-activable';
                }
            }
            classe += ' ' + byStatus;
        } else {
            console.log( 'node_getIcon(): invalid node' );
            console.log( node );
        }
        return classe;
    },
    // returns the applicable icon
    node_getIcon: function( node ){
        let icon = 'fa-spinner';
        if( node && node.obj ){
            switch( node.obj.type ){
                case 'A':
                    icon = 'fa-file-alt';
                    break;
                case 'P':
                    icon = 'fa-folder-open';
                    break;
                case 'R':
                    icon = 'fa-expand-arrows-alt';
                    break;
            }
        } else {
            console.log( 'node_getIcon(): invalid node' );
            console.log( node );
        }
        return icon;
    },
    node_isRoot: function( node ){
        return node && node.id === 'root';
    },
    // if $node is activable, then propagate to the up hierarchy
    //  a node is considered activable if at least one of its children is
    node_setActivable: function( node ){
        const fn = Template.projects_tree.fn;
        const _setRec = function( node ){
            //const li = $( node.element ).parents( 'li' )[0];
            if( node.activableCount > 0 ){
                $( node.element ).addClass( 'status-activable' );
                //console.log( node.name+' id='+node.id+' activableCount='+node.activableCount );
                //console.log( node );
            } else {
                $( node.element ).removeClass( 'status-activable' );
            }
            if( node.parent && !fn.node_isRoot( node.parent )){
                node.parent.activableCount += node.activableCount > 0 ? 1 : 0;
                _setRec( node.parent );
            }
        };
        if( node.obj.type !== 'A' ){
            console.log( 'node_setActivable() called for type='+node.obj.type );
        } else {
            const status = node.obj.status;
            node.activableCount = ActionStatus.isActionable( status ) ? 1 : 0;
            _setRec( node );
        }
    },

    // low-level tree functions
    // appends a new node or updates an existing one
    // returns the node
    tree_addNode: function( $tree, node ){
        const fn = Template.projects_tree.fn;
        if( fn.node_isRoot( node )){
            $tree.tree( 'appendNode', node );
            return;
        }
        const exists = $tree.tree( 'getNodeById', node.id );
        if( exists ){
            $tree.tree( 'updateNode', exists, node )
            return exists;
        }
        let parentNode = null;
        if( node.parent ){
            parentNode = $tree.tree( 'getNodeById', node.parent );
        }
        if( !parentNode ){
            parentNode = $tree.tree( 'getNodeById', 'root' );
        }
        $tree.tree( 'appendNode', node, parentNode );
        return $tree.tree( 'getNodeById', node.id );
    },
    // collapse the tree
    tree_collapse: function( $tree ){
        const _collapseRec = function( node ){
            if( node.children.length ){
                $tree.tree( 'closeNode', node )
                for( let i=0 ; i<node.children.length ; ++i ){
                    _collapseRec( node.children[i] );
                }
            }
        };
        _collapseRec( $tree.tree( 'getNodeById', 'root' ));
    },
    // called once from onRendered()
    tree_create: function( $tree, tab ){
        const fn = Template.projects_tree.fn;
        $tree.data( 'tab', tab );
        $tree.tree({
            autoOpen: true,
            dragAndDrop: true,
            saveState: 'ronin-projects-tree-'+tab,
            //closedIcon: $('<i class="fas fa-plus"></i>'),
            //openedIcon: $('<i class="fas fa-minus"></i>'),
            onCreateLi: function( node, $li, isSelected ){
                // Add 'icon' span before title
                const icon = fn.node_getIcon( node );
                const classe = fn.node_getClass( node );
                $li.find('.jqtree-title').before('<span class="fas '+icon+' icon"></span>');
                $li.addClass( classe );
            }
        });
    },
    // dump all
    tree_dump: function( $tree ){
        Template.projects_tree.fn.tree_dumpHtml( $tree );
        Template.projects_tree.fn.tree_dumpTree( $tree );
    },
    // dump the tree by HTML elements
    tree_dumpHtml: function( $tree ){
        const _dumpLi = function( $li, prefix ){
            console.log( prefix+$li.attr('class'));
            console.log( $li.data('node'));
            const $ul = $li.children('ul');
            if( $ul && $ul.length ){
                for( let i=0; i<$ul.length; i++ ){
                    _dumpUl( $($ul[i]), prefix+' ' );
                }
            }
        };
        const _dumpUl = function( $ul, prefix ){
            const $li = $ul.children('li');
            for( let i=0; i<$li.length; i++ ){
                _dumpLi( $($li[i]), prefix );
            }
        };
        if( $tree ){
            const $ul = $tree.children('ul:first-child');
            _dumpUl( $ul, '' );
        }
    },
    // dump the tree by nodes
    tree_dumpTree: function( $tree ){
        const _dumpRec = function( node, prefix ){
            console.log( prefix+node.name+' ('+node.id+')');
            for( let i=0; i<node.children.length; i++ ){
                _dumpRec( node.children[i], prefix+' ' );
            }
        };
        _dumpRec( $tree.tree( 'getNodeById', 'root' ), '' );
    },
    // empty the tree
    //  leaving only with the root node
    tree_empty: function( $tree ){
        $tree.tree( 'loadData', [], $tree.tree( 'getNodeById', 'root' ));
    },
    // expand the tree
    tree_expand: function( $tree ){
        const _expandRec = function( node ){
            if( node.children.length ){
                $tree.tree( 'openNode', node )
                for( let i=0 ; i<node.children.length ; ++i ){
                    _expandRec( node.children[i] );
                }
            }
        };
        _expandRec( $tree.tree( 'getNodeById', 'root' ));
    },
    // returns the order of nodes, as a JSON object only holding 'id' and 'type'
    tree_getJsonOrder: function( $tree ){
        // recursively filter the JSON object
        const _filter = function( json ){
            const out = new Array();
            JSON.parse( json ).forEach( it => {
                out.push( _filterRec( it ));
            });
            return JSON.stringify( out );
        };
        const _filterRec = function( it ){
            let obj = { id:it.id, type:it.obj.type };
            if( it.children ){
                obj.children = new Array();
                it.children.forEach( child => {
                    obj.children.push( _filterRec( child ));
                });
            }
            return obj;
        };
       return _filter( $tree.tree( 'toJson' ));
    },
    // is this object hold by this tree ?
    tree_hasId( $tree, id ){
        const node = $tree.tree( 'getNodeById', id );
        return node != null;
    },
    // insert the root node (type='R') of the tree
    tree_setRoot: function( $tree, label ){
        Template.projects_tree.fn.tree_addNode( $tree, {
            id: 'root',
            name: label,
            obj: {
                type: 'R'
            },
            activableCount: 0
        });
    },

    // add actions in each tab
    //  all actions with a parent are passed to projects tab - orphan actions are not detected
    inst_Actions: function( instance, order, fetched ){
        const fn = Template.projects_tree.fn;
        const $tree = instance.ronin.$tree;
        const tab = $tree.data( 'tab' );
        let count = 0;
        fetched.forEach( it => {
            //console.log( tab+': inst_Actions '+it.name );
            let node = {
                id: it._id,
                name: it.name,
                obj: it,
                activableCount: 0
            }
            let added = null;
            const p = it.parent ? Articles.findOne({ _id:it.parent, type:'P' }) : null;
            // on projects tab, attach to each project their relative actions
            if( tab === 'gtd-review-projects-current' ){
                if( p && !p.future ){
                    node.parent = it.parent;
                    added = fn.tree_addNode( $tree, node );
                }
            // on actions tab, display actions without a project
            } else if( tab === 'gtd-review-projects-single' ){
                if( !p ){
                    added = fn.tree_addNode( $tree, node );
                }
            // last display on future tab the actions attached to a future project
            } else if( tab === 'gtd-review-projects-future' ){
                if( p && p.future ){
                    node.parent = it.parent;
                    added = fn.tree_addNode( $tree, node );
                }
            } else {
                console.log( tab+': unknown tab' );
            }
            // propagate the activable status up to the hierarchy
            if( added ){
                fn.node_setActivable( added );
                count += 1;
            }
        });
        instance.ronin.dict.set( 'actions_count', count );
    },

    // we store in Counters collection the ordering of nodes for the current tree
    //  read this ordering at initialization time
    //  rewrite it each time a node is inserted/deleted/reparented
    inst_CountersRead( instance ){

    },
    inst_CountersUpdate( instance ){
        const fn = Template.projects_tree.fn;
        const order = fn.tree_getJsonOrder( instance.ronin.$tree );
        const tab = instance.ronin.$tree.data( 'tab' );
        Meteor.call( 'counters.setValue', 'tree-'+tab, order, ( e ) => {
            if( e ){
                messageError({ message: e.message });
            }
        });
    },

    // add the projects in projects and future tabs
    //  note that even if an order has been initially retrieved, fetched must still
    //  be explored for new items
    inst_Projects: function( instance, order, future, fetched ){
        const fn = Template.projects_tree.fn;
        const $tree = instance.ronin.$tree;
        let count = 0;
        // add a project node
        const _addNode = function( project, prefix ){
            if( project && ( future ? project.future : !project.future )){
                if( !$tree.tree( 'getNodeById', project._id )){
                    let node = {
                        id: project._id,
                        name:  project.name,
                        parent: project.parent,
                        obj: project,
                        activableCount: 0
                    };
                    //console.log( prefix+' adding '+node.obj.type+' '+node.obj.name+' future='+future );
                    fn.tree_addNode( $tree, node );
                    count += 1;
                }
            }
        };
        // recursively add projects starting from the saved JSON
        //  note that the project's attributes must be revalidated regarding to the
        //  current tab as they may have been modified since last save
        const _addRec = function( it, prefix ){
            if( it.id !== 'root' && it.type === 'P' ){
                _addNode( Articles.findOne({ _id:it.id }), prefix );
            }
            if( it.children ){
                it.children.forEach( child => {
                    _addRec( child, prefix+'>' );
                });
            }
        };
        // first deal with read order
        //  then also deal with all remaining fetched
        if( order ){
            order.forEach( it => {
                _addRec( it, '>' );
            });
        }
        fetched.forEach( it => {
            _addNode( it, '' );
        });
        instance.ronin.dict.set( 'projects_count', count );
    },

    inst_rebuildTree: function( instance ){
        const fn = Template.projects_tree.fn;
        fn.tree_empty( instance.ronin.$tree );
        instance.ronin.dict.set( 'step', fn.steps.TREE_BUILT );
    },

    // display done items (or not)
    displayDone: function( $tree, display ){
        const _displayLi = function( $li ){
            const node = $li.data('node');
            if( node.obj.type !== 'R' ){
                const done = node.obj.doneDate;
                let hidden = !display && done;
                //console.log( node.name+' display='+display+' done='+done+' hidden='+hidden );
                if( hidden ){
                    display = false;
                    $li.addClass( 'x-hidden' );
                } else {
                    $li.removeClass( 'x-hidden' );
                }
            }
            const $ul = $li.children('ul');
            if( $ul ){
                for( let i=0; i<$ul.length; i++ ){
                    _displayUl( $( $ul[i] ));
                }
            }
        };
        const _displayUl = function( $ul ){
            const $li = $ul.children('li');
            for( let i=0; i<$li.length; i++ ){
                _displayLi( $( $li[i] ));
            }
        };
        if( $tree ){
            const $ul = $tree.children('ul:first-child');
            //console.log( tab+' displayDone '+display );
            _displayUl( $ul );
        }
    },
};

// each tab will have more or less the same things to do, whether it displays
//  mainly actions or projects - so each tab has to deal with both actions and
//  projects subscriptions
Template.projects_tree.onCreated( function(){
    this.ronin = {
        tab: this.data.tab,
        dict: new ReactiveDict(),
        handles: {
            counters: this.subscribe( 'counters.all' ),
            projects: this.subscribe( 'articles.projects.all' ),
            actions: this.subscribe( 'articles.actions.all' )
        },
        $tree: null
    };
    this.ronin.dict.set( 'order', null );
    this.ronin.dict.set( 'step', 0 );
    this.ronin.dict.set( 'userId', Meteor.userId());
    this.ronin.dict.set( 'projects_count', 0 );
    this.ronin.dict.set( 'actions_count', 0 );
});

// the instance is rendered
//  we have tab from data context already stored in our object
Template.projects_tree.onRendered( function(){
    //console.log( 'projects_tree.onRendered '+this.data.tab );
    const fn = Template.projects_tree.fn;
    const self = this;

    // create the tree for this tab and display the root node
    //  identifies in each tree to which tab it is attached
    self.ronin.$tree = self.$( '.projects-tree .tree' );
    fn.tree_create( self.ronin.$tree, this.ronin.tab );
    fn.tree_setRoot( self.ronin.$tree, this.data.label );
    fn.menu_create( self.ronin.$tree, this.ronin.tab );

    // an empty tree is built
    //  a context menu is defined
    //  the root node is attached
    this.ronin.dict.set( 'step', fn.steps.TREE_BUILT );

    // display done defaults to true
    this.$('.js-done').prop( 'checked', true );

    // get the initial tree ordering when counters are here
    //  this is a prereq to be able to display projects and actions
    this.autorun(() => {
        const step = self.ronin.dict.get( 'step' );
        if( step >= fn.steps.TREE_BUILT && step < fn.steps.COUNTERS_GOT && self.ronin.handles.counters.ready()){
            const counters = Counters.findOne({ name:'tree-'+self.ronin.tab });
            self.ronin.dict.set( 'order', counters ? JSON.parse( counters.value ) : null );
            self.ronin.dict.set( 'step', fn.steps.COUNTERS_GOT );
            //console.log( 'step='+fn.steps.COUNTERS_GOT );
        }
    });

    // display projects
    //  this requires a built tree
    //  + the display ordering from counters
    //  + the subscription be ready
    this.autorun(() => {
        const step = self.ronin.dict.get( 'step' );
        if( step >= fn.steps.COUNTERS_GOT && step < fn.steps.PROJECTS_SHOWN ){
            if( self.ronin.tab === 'gtd-review-projects-single' ){
                self.ronin.dict.set( 'step', fn.steps.PROJECTS_SHOWN );
                //console.log( 'step='+fn.steps.PROJECTS_SHOWN );
            } else {
                if( self.ronin.handles.projects.ready()){
                    const ordering = self.ronin.dict.get( 'order' ); // may be empty
                    const future = ( self.ronin.tab === 'gtd-review-projects-future' );
                    let filter = { type:'P' };
                    filter.future = future ? true : { $ne: true };
                    const projects = Articles.find( filter ).fetch();
                    fn.inst_Projects( self, ordering, future, projects );
                    self.ronin.dict.set( 'step', fn.steps.PROJECTS_SHOWN );
                    //console.log( 'step='+fn.steps.PROJECTS_SHOWN );
                }
            }
        }
    });

    // display actions when they are available and the projects have been shown
    //  projects having been shown implies that other prereqs are ok
    //  + update nodeList with what has been actually made
    // doesn't filter on the parent: this let us be tolerant about no more existant projects
    this.autorun(() => {
        const step = self.ronin.dict.get( 'step' );
        if( step >= fn.steps.PROJECTS_SHOWN && step < fn.steps.ACTIONS_SHOWN && self.ronin.handles.actions.ready()){
            const ordering = self.ronin.dict.get( 'order' ); // may be empty
            const actions = Articles.find({ type:'A' }).fetch();
            fn.inst_Actions( self, ordering, actions );
            fn.inst_CountersUpdate( self );
            self.ronin.dict.set( 'step', fn.steps.ACTIONS_SHOWN );
            //console.log( 'step='+fn.steps.ACTIONS_SHOWN );
            //fn.dumpTree( self.ronin.$tree );
        }
    });

    // expand the tree at the end
    this.autorun(() => {
        const step = self.ronin.dict.get( 'step' );
        if( step >= fn.steps.ACTIONS_SHOWN && step < fn.steps.EXPANDED ){
            fn.tree_expand( self.ronin.$tree );
            self.ronin.dict.set( 'step', fn.steps.EXPANDED );
        }
    });

    // send the termination message
    //  it will be handled by the projectsList window
    this.autorun(() => {
        const step = self.ronin.dict.get( 'step' );
        if( step >= fn.steps.EXPANDED && step < fn.steps.ENDED ){
            self.ronin.$tree.trigger( 'projects-tree-built', {
                tab: self.ronin.tab,
                $tree: self.ronin.$tree,
                projects_count: self.ronin.dict.get( 'projects_count' ),
                actions_count: self.ronin.dict.get( 'actions_count' )
            });
            self.ronin.dict.set( 'step', fn.steps.ENDED );
        }
    });

    // rebuild the tree on signin/signout
    this.autorun(() => {
        const current = Meteor.userId();
        if( current !== self.ronin.dict.get( 'userId' )){
            self.ronin.dict.set( 'userId', current );
            fn.inst_rebuildTree( self );
        }
    });

    // it happends that the tree hierarchy does not react well to certains changes,
    //  and notably:
    //  - change of the parent of an action: the origin project is not updated
    //  - idem for the parent of a project
    //  - change of the future status of a project: the origin tab is not updated
    //  we so subscribe to the corresponding messages, and act accordingly
    jQuery.pubsub.subscribe( 'ronin.ui.item.deleted', ( msg, o ) => {
        if( self.ronin.$tree ){
            const node = self.ronin.$tree.tree( 'getNodeById', o._id );
            if( node ){
                self.ronin.$tree.tree( 'removeNode', node );
            } else {
                fn.inst_rebuildTree( self );
            }
        }
    });
});

Template.projects_tree.events({
    'change .js-done'( ev, instance ){
        const $tree = $( $( ev.currentTarget ).parents('.projects-tree')[0] ).find( '.tree' );
        const checked = instance.$('.js-done' ).is(':checked');
        Template.projects_tree.fn.displayDone( $tree, checked );
    },
    // moving a node means both reparenting and reordering it
    // note that we are refusing to move outside of the root node
    //  + we also refuse to drop an action inside another action
    'tree.move .projects-tree .tree'( ev, instance ){
        //console.log( 'ev ', ev );
        //console.log( 'moved_node', ev.move_info.moved_node );
        //console.log('target_node', ev.move_info.target_node);
        //console.log('position', ev.move_info.position);
        //console.log('previous_parent', ev.move_info.previous_parent);
        ev.preventDefault();
        if( ev.move_info.target_node.id === 'root' && ev.move_info.position !== 'inside' ){
            messageError({ message: 'Refusing to drop outside the root' });
            return false;
        }
        const target_type = ev.move_info.target_node.obj.type;
        if( target_type !== 'P' && target_type !== 'R' ){
            messageError({ message: 'Refusing to drop elsewhere than the root or a project' });
            return false;
        }
        $.pubsub.publish( 'ronin.model.article.reparent', {
            item: ev.move_info.moved_node.obj,
            parent: ev.move_info.target_node.id
        });
        ev.move_info.do_move();
        Template.projects_tree.fn.inst_CountersUpdate( instance );
    },
    // a request to collapse the tree sent by the tabs panel
    'projects-tree-collapse'( ev, instance ){
        Template.projects_tree.fn.tree_collapse( instance.ronin.$tree );
    },
    // a request to dump the tree sent by the tabs panel
    'projects-tree-dump'( ev, instance ){
        Template.projects_tree.fn.tree_dump( instance.ronin.$tree );
    },
    // a request to expand the tree sent by the tabs panel
    'projects-tree-expand'( ev, instance ){
        Template.projects_tree.fn.tree_expand( instance.ronin.$tree );
    },
    // a request to rebuild the tree sent by the tabs panel
    'projects-tree-rebuild'( ev, instance ){
        Template.projects_tree.fn.inst_rebuildTree( instance );
    }
});
