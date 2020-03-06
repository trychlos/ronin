/*
 * 'projects_tree' component.
 *  Display and manage the projects hierarchy tree.
 *  A new tree is instanciated for each tab.
 *
 *  Parameters:
 *  - label: the label to be displayed as the root node
 *  - tab: the identifier of the created instance (may not be the one currently shown),
 *  - projects: the projects cursor,
 *  - actions: the actions cursor,
 *  - counters: the counters cursor.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import { Counters } from '/imports/api/collections/counters/counters.js';
import { actionStatus } from '/imports/api/resources/action_status/action_status.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import 'jqtree/tree.jquery.js';
import 'jqtree/jqtree.css';
import './projects_tree.html';

Template.projects_tree.fn = {
    // the tree is built by successive steps
    steps: {
        tree_built:     1,
        counters_got:   2,
        projects_shown: 3,
        actions_shown:  4,
        expanded:       5,
        ended:          9
    },
    // context menu
    //  note that this context menu is not available in a touchable device
    //  so do not event try to display it
    _cm_createMenu: function( $tree, tab ){
        if( g.run.layout.get() === LYT_WINDOW ){
            const fn = Template.projects_tree.fn;
            $tree.contextMenu({
                selector: 'li.jqtree_common span.jqtree-title',
                build: function( elt, ev ){
                    return {
                        items: {
                            edit: {
                                name: 'Edit',
                                icon: 'fas fa-edit',
                                callback: function( item, opts, event ){
                                    const node = $( $( opts.$trigger ).parents('li')[0] ).data( 'node' );
                                    if( !fn.nodeIsRoot( node )){
                                        fn._cm_edit( $tree, node );
                                    }
                                },
                                disabled: function( key, opts ){
                                    const node = $( $( this ).parents('li')[0] ).data( 'node' );
                                    return fn.nodeIsRoot( node );
                                }
                            },
                            delete: {
                                name: 'Delete',
                                icon: 'fas fa-trash-alt',
                                callback: function( item, opts, event ){
                                    const node = $( $( opts.$trigger ).parents('li')[0] ).data( 'node' );
                                    if( !fn.nodeIsRoot( node )){
                                        fn._cm_delete( $tree, node );
                                    }
                                },
                                disabled: function( key, opts ){
                                    const node = $( $( this ).parents('li')[0] ).data( 'node' );
                                    return fn.nodeIsRoot( node );
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
    // contextual menu, delete operation
    _cm_delete: function( $tree, node ){
        const fn = Template.projects_tree.fn;
        if( !fn.nodeIsRoot( node )){
            $.pubsub.publish( 'ronin.model.article.delete', node.obj );
        }
    },
    // contextual menu, edit operation
    _cm_edit: function( $tree, node ){
        const fn = Template.projects_tree.fn;
        if( !fn.nodeIsRoot( node )){
            g.run.back = FlowRouter.current().route.name;
            switch( node.obj.type ){
                case 'A':
                    FlowRouter.go( 'rt.actions.edit', null, { id:node.obj._id });
                    break;
                case 'P':
                    FlowRouter.go( 'rt.projects.edit', null, { id:node.obj._id });
                    break;
            }
        }
    },

    // low-level tree functions
    // returns the node
    _llt_addNode: function( $tree, node ){
        const fn = Template.projects_tree.fn;
        if( fn.nodeIsRoot( node )){
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
    // called once from onRendered()
    _llt_createTree: function( $tree, tab ){
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
                const icon = fn._llt_itemIcon( node );
                const classe = fn._llt_itemClass( node );
                $li.find('.jqtree-title').before('<span class="fas '+icon+' icon"></span>');
                $li.addClass( classe );
            }
        });
    },
    // empty the tree
    _llt_empty: function( $tree ){
        const tree = $tree.tree( 'getTree' );
        const root = tree.children[0];
        const name = root.name;
        $tree.tree( 'loadData', [] );
        Template.projects_tree.fn._llt_setRoot( $tree, name );
    },
    // returns the ad-hoc class for the item LI
    _llt_itemClass: function( node ){
        let classe = '';
        if( node && node.obj ){
            switch( node.obj.type ){
                case 'A':
                    classe = node.obj.status === 'don' ? 'rev-status-done' :
                        ( actionStatus.isActionable( node.obj.status ) ? 'rev-status-activable' : '' );
                    break;
                case 'R':
                    classe = 'rev-node-root';
                    break;
            }
        }
        return classe;
    },
    // returns the applicable icon
    _llt_itemIcon: function( node ){
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
                    icon = 'fa-compress-arrows-alt';
                    break;
            }
        }
        return icon;
    },
    // insert the root node (type='R') of the tree
    _llt_setRoot: function( $tree, label ){
        Template.projects_tree.fn._llt_addNode( $tree, {
            id: 'root',
            name: label,
            obj: {
                type: 'R'
            }
        });
    },

    // add actions in each tab
    //  all actions with a parent are passed to projects tab - orphan actions are not detected
    addActions: function( $tree, order, fetched ){
        const tab = $tree.data( 'tab' );
        fetched.forEach( it => {
            //console.log( tab+': addActions '+it.name );
            let node = {
                id: it._id,
                name: it.name,
                obj: it
            }
            // on projects tab, attach to each project their relative actions
            if( tab === 'gtd-review-projects-current' ){
                if( it.parent ){
                    const p = Articles.findOne({ _id:it.parent, type:'P' });
                    if( p && !p.future ){
                        node.parent = it.parent;
                        const added = Template.projects_tree.fn._llt_addNode( $tree, node );
                        Template.projects_tree.fn.setActivable( $tree, added );
                    }
                }
            // on actions tab, display actions without a project
            } else if( tab === 'gtd-review-projects-single' ){
                if( !it.parent ){
                    const added = Template.projects_tree.fn._llt_addNode( $tree, node );
                    Template.projects_tree.fn.setActivable( $tree, added );
                }
            // last display on future tab the actions attached to a future project
            } else if( tab === 'gtd-review-projects-future' ){
                if( it.parent ){
                    const p = Articles.findOne({ _id:it.project, type:'P' });
                    if( p && p.future ){
                        node.parent = it.parent;
                        const added = Template.projects_tree.fn._llt_addNode( $tree, node );
                        Template.projects_tree.fn.setActivable( $tree, added );
                    }
                }
            } else {
                console.log( tab+': unknown tab' );
            }
        });
    },
    // add the projects in projects and future tabs
    //  note that even if an order has been initially retrieved, fetched must still
    //  be explored for new items
    addProjects: function( $tree, order, future, fetched ){
        //console.log( $tree.tree( 'getNodeById', 'root' ));
        const fn = Template.projects_tree.fn;
        if( order ){
            order.forEach( it => {
                fn._addProjectsRec( $tree, future, it, '>' );
            });
        }
        fetched.forEach( it => {
            fn._addProjectNode( $tree, future, it, '' );
        });
    },
    // add a project node
    _addProjectNode: function( $tree, future, project, prefix ){
        const fn = Template.projects_tree.fn;
        if( project && ( future ? project.future : !project.future )){
            if( !$tree.tree( 'getNodeById', project._id )){
                let node = {
                    id: project._id,
                    name:  project.name,
                    parent: project.parent,
                    obj: project
                };
                //console.log( prefix+' adding '+node.obj.type+' '+node.obj.name+' future='+future );
                fn._llt_addNode( $tree, node );
            }
        }
    },
    // recursively add projects starting from the saved JSON
    //  note that the project's attributes must be revalidated regarding to the
    //  current tab as they may have been modified since last save
    _addProjectsRec: function( $tree, future, it, prefix ){
        const fn = Template.projects_tree.fn;
        if( it.id !== 'root' && it.type === 'P' ){
            fn._addProjectNode( $tree, future, Articles.findOne({ _id:it.id }), prefix );
        }
        if( it.children ){
            it.children.forEach( child => {
                fn._addProjectsRec( $tree, future, child, prefix+'>' );
            });
        }
    },

    // display done items (or not)
    displayDone: function( $tree, display ){
        if( $tree ){
            const $ul = $tree.children('ul:first-child');
            //console.log( tab+' displayDone '+display );
            Template.projects_tree.fn._displayDoneUl( $ul, display );
        }
    },
    _displayDoneLi: function( $li, display ){
        const node = $li.data('node');
        if( node.obj.type !== 'R' ){
            const done = node.obj.doneDate;
            let hidden = !display && done;
            console.log( node.name+' display='+display+' done='+done+' hidden='+hidden );
            if( hidden ){
                display = false;
                $li.addClass('x-hidden');
            } else {
                $li.removeClass('x-hidden');
            }
        }
        const $ul = $li.children('ul');
        if( $ul ){
            for( let i=0; i<$ul.length; i++ ){
                Template.projects_tree.fn._displayDoneUl( $($ul[i]), display );
            }
        }
    },
    _displayDoneUl: function( $ul, display ){
        const $li = $ul.children('li');
        for( let i=0; i<$li.length; i++ ){
            Template.projects_tree.fn._displayDoneLi( $($li[i]), display );
        }
    },
    // dump the tree by HTML elements
    dumpHtml: function( $tree ){
        if( $tree ){
            const $ul = $tree.children('ul:first-child');
            Template.projects_tree.fn._dumpHtmlUl( $ul, '' );
        }
    },
    _dumpHtmlLi: function( $li, prefix ){
        console.log( prefix+$li.attr('class'));
        console.log( $li.data('node'));
        const $ul = $li.children('ul');
        if( $ul && $ul.length ){
            for( let i=0; i<$ul.length; i++ ){
                Template.projects_tree.fn._dumpHtmlUl( $($ul[i]), prefix+' ' );
            }
        }
    },
    _dumpHtmlUl: function( $ul, prefix ){
        const $li = $ul.children('li');
        for( let i=0; i<$li.length; i++ ){
            Template.projects_tree.fn._dumpHtmlLi( $($li[i]), prefix );
        }
    },
    // dump the tree by nodes
    dumpTree: function( $tree ){
        if( $tree ){
            const root = $tree.tree('getNodeById','root');
            Template.projects_tree.fn._dumpTreeRec( $tree, root, '' );
        }
    },
    _dumpTreeRec: function( $tree, node, prefix ){
        console.log( prefix+node.name+' ('+node.id+')');
        for( let i=0; i<node.children.length; i++ ){
            Template.projects_tree.fn._dumpTreeRec( $tree, node.children[i], prefix+' ' );
        }
    },
    // expand the tree
    expandAll: function( $tree ){
        const root = $tree.tree( 'getNodeById', 'root' );
        Template.projects_tree.fn._expandAll_rec( $tree, root );
    },
    _expandAll_rec: function( $tree, node ){
        if( node.children.length ){
            $tree.tree( 'openNode', node )
            for( let i=0 ; i<node.children.length ; ++i ){
                Template.projects_tree.fn._expandAll_rec( $tree, node.children[i] );
            }
        }
    },
    // transforms the JSON object returned by tree('toJson') by removing all but id's
    //  returns a JSON string
    jsonFilter: function( json ){
        const js = JSON.parse( json );
        const out = new Array();
        js.forEach( it => {
            out.push( Template.projects_tree.fn._jsonFilterRec( it ));
        });
        return JSON.stringify( out );
    },
    _jsonFilterRec: function( it ){
        let obj = { id:it.id, type:it.obj.type };
        if( it.children ){
            obj.children = new Array();
            it.children.forEach( child => {
                obj.children.push( Template.projects_tree.fn._jsonFilterRec( child ));
            });
        }
        return obj;
    },
    nodeIsRoot: function( node ){
        return node.id === 'root';
    },
    // if $node is activable, then propagate to the up hierarchy
    setActivable: function( $tree, node ){
        if( node.obj.type !== 'A' ){
            console.log( 'project_tree:setActivable for type='+node.obj.type );
        } else {
            const status = node.obj.status;
            const activable = actionStatus.isActionable( status );
            //console.log( 'node '+node.name+' status='+status+' activable='+activable );
            Template.projects_tree.fn._setActivableRec( $tree, node, activable );
        }
    },
    _setActivableRec: function( $tree, node, activable ){
        /*
         * doesn't work
         */
        const $li = $(node.element).parent('li');
        if( activable ){
            $li.addClass( 'rev-activable' );
        } else {
            $li.removeClass( 'rev-activable' );
        }
        if( node.parent ){
            Template.projects_tree.fn._setActivableRec( $tree, node.parent, activable );
        }
    }
};

// each tab will have have more or less the same things to do, whether it displays
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
        }
    };
    this.ronin.dict.set( 'order', null );
    this.ronin.dict.set( 'step', 0 );
    this.ronin.dict.set( 'userId', Meteor.userId());
});

// the instance is rendered
//  we have tab from data context already stored in our object
Template.projects_tree.onRendered( function(){
    //console.log( 'projects_tree.onRendered '+this.data.tab );
    const fn = Template.projects_tree.fn;
    const self = this;

    // create the tree for this tab and display the root node
    //  identifies in each tree to which tab it is attached
    const $tree = this.$( '.projects-tree .tree' );
    fn._llt_createTree( $tree, this.ronin.tab );
    fn._llt_setRoot( $tree, this.data.label );
    fn._cm_createMenu( $tree, this.ronin.tab );
    this.ronin.dict.set( 'step', fn.steps.tree_built );

    // display done defaults to true
    this.$('.js-done').prop( 'checked', true );

    // get the initial tree ordering when counters are here
    //  this is a prereq to be able to display projects and actions
    this.autorun(() => {
        const step = self.ronin.dict.get( 'step' );
        if( step >= fn.steps.tree_built && step < fn.steps.counters_got && self.ronin.handles.counters.ready()){
            const counters = Counters.findOne({ name:'tree-'+self.ronin.tab });
            self.ronin.dict.set( 'order', counters ? JSON.parse( counters.value ) : null );
            self.ronin.dict.set( 'step', fn.steps.counters_got );
        }
    });

    // display projects from the passed-in cursor
    //  this requires a built tree, and the display ordering from counters
    this.autorun(() => {
        const step = self.ronin.dict.get( 'step' );
        if( step >= fn.steps.counters_got && step < fn.steps.projects_shown ){
            if( self.ronin.tab === 'gtd-review-projects-single' ){
                self.ronin.dict.set( 'step', fn.steps.projects_shown ); // nothing to do here
            } else {
                if( self.ronin.handles.projects.ready()){
                    const ordering = self.ronin.dict.get( 'order' ); // may be empty
                    const future = ( self.ronin.tab === 'gtd-review-projects-future' );
                    let filter = { type:'P' };
                    filter.future = future ? true : { $ne: true };
                    fn.addProjects( $tree, ordering, future, Articles.find( filter ).fetch());
                    self.ronin.dict.set( 'step', fn.steps.projects_shown );
                }
            }
        }
    });

    // display actions when they are available and the projects have been shown
    //  projects having been shown implies that other prereqs are ok
    this.autorun(() => {
        const step = self.ronin.dict.get( 'step' );
        if( step >= fn.steps.projects_shown && step < fn.steps.actions_shown && self.ronin.handles.actions.ready()){
            const ordering = self.ronin.dict.get( 'order' ); // may be empty
            let filter = { type:'A' };
            filter.parent = self.ronin.tab === 'gtd-review-projects-single' ? null : { $ne:null };
            fn.addActions( $tree, ordering, Articles.find( filter ).fetch());
            self.ronin.dict.set( 'step', fn.steps.actions_shown );
        }
    });

    // expand the tree at the end
    this.autorun(() => {
        const step = self.ronin.dict.get( 'step' );
        if( step >= fn.steps.actions_shown && step < fn.steps.expanded ){
            fn.expandAll( $tree );
            self.ronin.dict.set( 'step', fn.steps.expanded );
        }
    });

    // send the termination message
    this.autorun(() => {
        const step = self.ronin.dict.get( 'step' );
        if( step >= fn.steps.expanded && step < fn.steps.ended ){
            $tree.trigger( 'projects-tree-built', self.ronin.tab );
            self.ronin.dict.set( 'step', fn.steps.ended );
        }
    });

    // rebuild the tree on signin/signout
    this.autorun(() => {
        const current = Meteor.userId();
        if( current !== self.ronin.dict.get( 'userId' )){
            self.ronin.dict.set( 'userId', current );
            fn._llt_empty( $tree );
            self.ronin.dict.set( 'step', fn.steps.tree_built );
        }
    });

    // it happends that the tree hierarchy does not react well to certains changes,
    //  and notably:
    //  - change of the parent of an action: the origin project is not updated
    //  - idem for the parent of a project
    //  - change of the future status of a project: the origin tab is not updated
    //  we so subscribe to the corresponding messages, and act accordingly
    $.pubsub.subscribe( 'ronin.ui.item.updated', ( msg, o ) => {
        if( $tree && o.orig ){
            if((( o.edit.type === 'A' || o.edit.type === 'P' ) && ( o.orig.parent !== o.edit.parent )) ||
                ( o.edit.type === 'P' && o.orig.future !== o.edit.future )){

                fn._llt_empty( $tree );
                self.ronin.dict.set( 'step', fn.steps.tree_built );
            }
        }
    });
    $.pubsub.subscribe( 'ronin.ui.item.deleted', ( msg, o ) => {
        if( $tree ){
            fn._llt_empty( $tree );
            self.ronin.dict.set( 'step', fn.steps.tree_built );
        }
    });
});

Template.projects_tree.events({
    'change .js-done'( ev, instance ){
        const $tree = $( $( ev.currentTarget ).parents('.projects-tree')[0] ).find( '.tree' );
        const checked = instance.$('.js-done' ).is(':checked');
        Template.projects_tree.fn.displayDone( $tree, checked );
    },
    'click .js-expand'( ev, instance ){
        const $tree = $( $( ev.currentTarget ).parents('.projects-tree')[0] ).find( '.tree' );
        Template.projects_tree.fn.expandAll( $tree );
    },
    'change .js-collapse'( ev, instance ){
        const tab = $( ev.currentTarget ).parent('.actions').prev('.tree').data('tab');
        const checked = instance.$('.js-collapse' ).is(':checked');
        console.log( tab+' collapse '+checked );
    },
    'click .js-dump'( ev, instance ){
        const $tree = $( $( ev.currentTarget ).parents('.projects-tree')[0] ).find( '.tree' );
        Template.projects_tree.fn.dumpTree( $tree );
        Template.projects_tree.fn.dumpHtml( $tree );
    },
    // moving a node means both reparenting and reordering it
    // note that we are refusing to move outside of the root node
    //  + we also refuse to drop an action inside another action
    'tree.move .projects-tree .tree'( ev ){
        //console.log( 'ev ', ev );
        //console.log( 'moved_node', ev.move_info.moved_node );
        //console.log('target_node', ev.move_info.target_node);
        //console.log('position', ev.move_info.position);
        //console.log('previous_parent', ev.move_info.previous_parent);
        ev.preventDefault();
        if( ev.move_info.target_node.id === 'root' && ev.move_info.position !== 'inside' ){
            throwError({ message: 'Refusing to drop outside the root' });
            return false;
        }
        const target_type = ev.move_info.target_node.obj.type;
        if( target_type !== 'P' && target_type !== 'R' ){
            throwError({ message: 'Refusing to drop elsewhere than the root or a project' });
            return false;
        }
        const obj = ev.move_info.moved_node.obj;
        Meteor.call( 'articles.reparent', obj._id, ev.move_info.target_node.id, ( e ) => {
            if( e ){
                throwError({ message: e.message });
                return false;
            }
        });
        ev.move_info.do_move();
        const $tree = $( ev.target );
        const tab = $tree.data( 'tab' );
        const json = Template.projects_tree.fn.jsonFilter( $tree.tree( 'toJson' ));
        Meteor.call( 'counters.setValue', 'tree-'+tab, json, ( e ) => {
            if( e ){
                throwError({ message: e.message });
                return false;
            }
        });
    }
});
