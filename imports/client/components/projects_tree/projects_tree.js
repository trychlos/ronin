/*
 * 'projects_tree' component.
 *  Display and manage the projects hierarchy tree.
 *  A new tree is instanciated for each tab.
 * 
 *  Parameters:
 *  - label: the label to be displayed as the root node
 *  - tab: the identifier of the created instance (may not be the one currently shown).
 */
import { Actions } from '/imports/api/collections/actions/actions.js';
import { Counters } from '/imports/api/collections/counters/counters.js';
import { Projects } from '/imports/api/collections/projects/projects.js';
import '/imports/client/components/errors/errors.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import 'jqtree';
//import 'jqtree/jqtree.css';
import './projects_tree.html';

Template.projects_tree.fn = {
    // dict handles a key per tab, with data as:
    //  actionsHandle, projectsHandle: data subscription handles
    //  tree: the root tree node
    //  projectsShown: a reactive var true when projects have been shown
    dict: {},
    // add actions in each tab
    addActions: function( tab, fetched ){
        const $tree = Template.projects_tree.fn.dict[tab] ? Template.projects_tree.fn.dict[tab].tree : null;
        if( !$tree ){
            console.log( tab+': addActions while $tree not built' );
            return;
        }
        const pNone = Projects.findOne({ code: 'non' });
        fetched.forEach( it => {
            //console.log( tab+': addActions '+it.name );
            let node = {
                id: it._id,
                name: it.name,
                obj: it
            }
            node.obj.type = 'A';
            // on projects tab, attach to each project their relative actions
            if( tab === 'projects' ){
                if( it.project && it.project !== pNone._id ){
                    const p = Projects.findOne({ _id: it.project });
                    if( p && !p.future ){
                        node.parent = it.project;
                        const added = Template.projects_tree.fn.addNode( $tree, node );
                        Template.projects_tree.fn.setActivable( $tree, added );
                    }
                }
            // on actions tab, display actions without a project
            } else if( tab === 'actions' ){
                if( !it.project || it.project === pNone._id ){
                    const added = Template.projects_tree.fn.addNode( $tree, node );
                    Template.projects_tree.fn.setActivable( $tree, added );
                }
            // last display on future tab the actions attached to a future project
            } else if( tab === 'future' ){
                if( it.project && it.project !== pNone._id ){
                    const p = Projects.findOne({ _id: it.project });
                    if( p && p.future ){
                        node.parent = it.project;
                        const added = Template.projects_tree.fn.addNode( $tree, node );
                        Template.projects_tree.fn.setActivable( $tree, added );
                    }
                }
            } else {
                console.log( tab+': unknown tab' );
            }
        });
    },
    addNode: function( $tree, node ){
        if( node.id === 'root' ){
            //console.log( 'appending root node' );
            $tree.tree( 'appendNode', node );
            return;
        }
        const existing = $tree.tree( 'getNodeById', node.id );
        if( existing ){
            $tree.tree( 'updateNode', existing, node )
            return existing;
        }
        let parentNode = null;
        //console.log( 'node='+node.name+' parent='+node.parent );
        if( node.parent ){
            parentNode = $tree.tree( 'getNodeById', node.parent );
            //console.log( 'found parent='+parentNode );
        }
        if( !parentNode ){
            parentNode = $tree.tree( 'getNodeById', 'root' );
        }
        //console.log( 'appending node id='+node.id+' parent='+parentNode );
        $tree.tree( 'appendNode', node, parentNode );
        //console.log( tab+' addNode '+node.name );
        return $tree.tree( 'getNodeById', node.id );
    },
    // add the projects in projects and future tabs
    //  note that even if an order has been initially retrieved, fetched must still
    //  be explored for new items
    addProjects: function( tab, future, fetched ){
        const $tree = Template.projects_tree.fn.dict[tab] ? Template.projects_tree.fn.dict[tab].tree : null;
        if( !$tree ){
            console.log( tab+': addProjects while $tree not built' );
            return;
        }
        const order = Template.projects_tree.fn.dict[tab].order.get();
        if( order ){
            order.forEach( it => {
                Template.projects_tree.fn._addProjectsRec( $tree, future, it, '>' );
            });
        }
        fetched.forEach( it => {
            Template.projects_tree.fn._addProjectNode( $tree, future, it, '' );
        });
},
    // add a project node
    _addProjectNode: function( $tree, future, project, prefix ){
        if( project.future === future ){
            if( !$tree.tree( 'getNodeById', project._id )){
                let node = {
                    id: project._id,
                    name:  project.name,
                    parent: project.parent,
                    obj: project
                };
                node.obj.type = 'P';
                Template.projects_tree.fn.addNode( $tree, node );
                //console.log( prefix+' adding '+node.obj.type+' '+node.name );
            }
        }
    },
    // recursively add projects starting from the saved JSON
    //  note that the project's attributes must be revalidated regarding to the
    //  current tab as they may have been modified since last save
    _addProjectsRec: function( $tree, future, it, prefix ){
        if( it.id !== 'root' && it.type === 'P' ){
            Template.projects_tree.fn._addProjectNode( $tree, future, Projects.findOne({ _id:it.id }), prefix );
        }
        if( it.children ){
            it.children.forEach( child => {
                Template.projects_tree.fn._addProjectsRec( $tree, future, child, prefix+'>' );
            });
        }
    },
    // delete a node, both in the server side and in the tree
    //  and recursively for each child
    //  NB deleting a hierarchy actually means a recursion for deletion in the sgbd
    //  but only the deletion of the only parent relatively to the DOM
    deleteNode( $tree, node ){
        Template.projects_tree.fn._deleteNodeRec( $tree, node );
        $tree.tree( 'removeNode', node );
    },
    _deleteNodeRec( $tree, node ){
        const method = node.obj.type === 'A' ? 'actions.remove' : 'projects.remove';
        //console.log( 'Meteor.call '+method+' '+node.name );
        Meteor.call( method, node.obj._id, ( error ) => {
            if( error ){
                return throwError({ message: error.message });
            }
        });
        for( var i=0 ; i<node.children.length ; ++i ){
            Template.projects_tree.fn._deleteNodeRec( $tree, node.children[i] );
        }
    },
    // display done items (or not)
    displayDone: function( tab, display ){
        const $tree = Template.projects_tree.fn.dict[tab] ? Template.projects_tree.fn.dict[tab].tree : null;
        if( $tree ){
            const $ul = $tree.children('ul:first-child');
            //console.log( tab+' displayDone '+display );
            Template.projects_tree.fn._displayDoneUl( $ul, display );
        }
    },
    _displayDoneLi: function( $li, display ){
        const node = $li.data('node');
        if( node.obj.type !== 'R' ){
            const done = node.obj.type === 'A' ? node.obj.status === 'don' : node.obj.ended;
            let hidden = !display && done;
            //console.log( node.name+' display='+display+' done='+done+' hidden='+hidden );
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
    dumpHtml: function( tab ){
        const $tree = Template.projects_tree.fn.dict[tab] ? Template.projects_tree.fn.dict[tab].tree : null;
        if( $tree ){
            const $ul = $tree.children('ul:first-child');
            Template.projects_tree.fn._dumpHtmlUl( $ul, '' );
        }
    },
    _dumpHtmlLi: function( $li, prefix ){
        console.log( prefix+$li.attr('class')+' ('+$li.data('node')+')');
        objDumpProps( $li.data('node'));
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
    dumpTree: function( tab ){
        const $tree = Template.projects_tree.fn.dict[tab] ? Template.projects_tree.fn.dict[tab].tree : null;
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
    // returns the ad-hoc class for the item LI
    getItemClass: function( node ){
        return node && node.obj && node.obj.type === 'A' ?
            ( node.obj.status === 'don' ? 'rev-status-done' :
                ( node.obj.status !== 'ina' ? 'rev-status-activable' : '' )) : '';
    },
    // returns the appliable icon
    getItemIcon: function( node ){
        return node && node.obj && node.obj.type === 'A' ? 'fa-radiation-alt' : 'fa-folder-open';
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
    // An item has been changed so that is must be moved from one tree to another
    //  Though the Meteor reactivity takes care of inserting into the target tree
    //  we have to take care ourselves of removing from old tree
    //  Here, the 'future' status of a project has been switched.
    //  - future: previous value
    //  - id: project id (because only project has this flag)
    obsoleteFuture: function( future, id ){
        const tab = future ? 'future' : 'projects';
        const $tree =  Template.projects_tree.fn.dict[tab].tree;
        const node = $tree.tree( 'getNodeById', id );
        if( node ){
            $tree.tree( 'removeNode', node );
        }
    },
    // An item (action or project) has been reparented
    //  - parent: previous parent
    //  - id: item id
    obsoleteParent: function( parent, id ){
        const pNone = Projects.findOne({ code: 'non' });
        const searched = parent && parent !== pNone._id ? parent : 'root';
        //console.log( 'obsoletedParent='+parent+' id='+id+' searched='+searched );
        const tabs = Object.keys( Template.projects_tree.fn.dict );
        for( var i=0 ; i<tabs.length ; ++i ){
            const $tree = Template.projects_tree.fn.dict[tabs[i]].tree;
            const node = $tree.tree( 'getNodeById', searched );
            if( node ){
                const child = $tree.tree( 'getNodeById', id );
                if( child ){
                    $tree.tree( 'removeNode', child );
                }
            }
        }
    },
    // contextual menu, delete operation
    opeDelete: function( tab, node ){
        if( node.id !== 'root' ){
            //console.log( tab+': about to delete '+node.name );
            //objDumpProps( node );
            let msg = 'Are you sure you want to delete the \''+node.name+'\' ';
            msg += node.obj.type === 'A' ? 'action' : 'project';
            if( node.children.length > 0 ){
                msg += ', and all its children';
            }
            msg += ' ?';
            const $tree = Template.projects_tree.fn.dict[tab].tree;
            $tree.parent().append('<div class="dialog"></div>');
            const $dialog = $('.projects-tree .dialog');
            $dialog.text( msg );
            $dialog.dialog({
                buttons: [
                    {
                        text: 'Delete',
                        click: function(){
                            Template.projects_tree.fn.deleteNode( $tree, node );
                            $( this ).dialog( 'close' );
                    }},
                    {
                        text: 'Cancel',
                        click: function(){
                            $( this ).dialog( 'close' );
                    }}
                ],
                modal: true,
                resizable: false,
                title: 'Confirmation is requested',
                width: 400
            });
        }
    },
    // contextual menu, edit operation
    opeEdit: function( tab, node ){
        if( node.id !== 'root' ){
            //console.log( tab+': editing '+node.name );
            const $tree = Template.projects_tree.fn.dict[tab].tree;
            Session.set( 'process.edit.obj', node.obj );
            $tree.IWindowed( 'showNew', 'editWindow' );
        }
    },
    // Remove the node from the tab
    removeTabNode: function( tab, node ){
        const $tree = Template.projects_tree.fn.dict[tab].tree;
        Template.projects_tree.fn.removeTreeNode( $tree, node );
    },
    // Remove the node from the tree
    removeTreeNode: function( $tree, node ){
        $tree.tree( 'removeNode', node );
        for( var i=0 ; i<node.children.length ; ++i ){
            Template.projects_tree.fn.removeTreeNode( $tree, node.children[i] );
        }
    },
    // if $node is activable, then propagate to the up hierarchy
    setActivable: function( $tree, node ){
        if( node.obj.type !== 'A' ){
            console.log( 'project_tree:setActivable for type='+node.obj.type );
        } else {
            const status = node.obj.status;
            const activable = ( status !== 'ina' && status !== 'don' );
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
    },
    // insert the root node (type='R') of the tree
    setRootNode: function( tab, label ){
        const $tree = Template.projects_tree.fn.dict[tab] ? Template.projects_tree.fn.dict[tab].tree : null;
        if( !$tree ){
            console.log( tab+': setRootNode while $tree not built' );
            return;
        }
        //console.log( tab+' setRootNode '+label );
        Template.projects_tree.fn.addNode( $tree, {
            id: 'root',
            name: label,
            obj: {
                type: 'R'
            }
        });
    }
};

Template.projects_tree.onCreated( function(){
    // initialize our internal data for this tab
    const tab = this.data.tab;
    if( tab ){
        Template.projects_tree.fn.dict[tab] = {
            actionsHandle:  this.subscribe('actions.all'),
            countersHandle: this.subscribe( 'counters.all' ),
            projectsHandle: this.subscribe('projects.all'),
            countersGot:    new ReactiveVar( false ),
            projectsShown:  new ReactiveVar( false ),
            tree:           null,
            order:          new ReactiveVar( null )
        }
    }
});

Template.projects_tree.onRendered( function(){
    const fn = Template.projects_tree.fn;
    // create the tree for this tab and display the root node
    const tab = this.data.tab;
    if( tab ){
        const $tree = this.$('.projects-tree .tree');
        $tree.data('tab',tab);
        $tree.tree({
            autoOpen: true,
            dragAndDrop: true,
            saveState: 'ronin-projects-tree-'+tab,
            closedIcon: $('<i class="fas fa-plus"></i>'),
            openedIcon: $('<i class="fas fa-minus"></i>'),
            onCreateLi: function( node, $li, isSelected ){
                // Add 'icon' span before title
                const icon = fn.getItemIcon( node );
                const classe = fn.getItemClass( node );
                $li.find('.jqtree-title').before('<span class="fas '+icon+' icon"></span>');
                $li.addClass( classe );
            }
        });
        fn.dict[tab].tree = $tree;
        fn.setRootNode( tab, this.data.label );
        // define the context menu
        $tree.contextMenu({
            selector: 'li.jqtree_common span.jqtree-title',
            build: function( $elt, ev ){
                return {
                    items: {
                        edit: {
                            name: 'Edit',
                            icon: 'fas fa-edit',
                            callback: function( item, opts, event ){
                                const node = $( $(opts.$trigger).parents('li')[0] ).data('node');
                                if( node.id !== 'root' ){
                                    fn.opeEdit( tab, node );
                                }
                            }
                        },
                        delete: {
                            name: 'Delete',
                            icon: 'fas fa-trash-alt',
                            callback: function( item, opts, event ){
                                const node = $( $(opts.$trigger).parents('li')[0] ).data('node');
                                if( node.id !== 'root' ){
                                    fn.opeDelete( tab, node );
                                }
                            }
                        }
                    },
                    autoHide: true,
                    // executed in the selector (triggering object) context
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
        // display done defaults to true
        this.$('.js-done').prop('checked', true );
    }
    // get the initial tree ordering when counters are here
    this.autorun(() => {
        const tab = this.data.tab;
        if( tab &&
            fn.dict[tab].countersHandle.ready()){
                Meteor.call( 'counters.getValue', 'tree_'+tab, ( error, result ) => {
                    //console.log( tab+' json async callback '+result );
                    if( result ){
                        fn.dict[tab].order.set( JSON.parse( result ));
                    }
                });
                fn.dict[tab].countersGot.set( true );
        }
    });
    // display projects when they are available
    //  the method takes care of displaying them depending of the current tab
    //  also update the projects
    this.autorun(() => {
        const tab = this.data.tab;
        if( tab &&
            fn.dict[tab].countersGot.get() &&
            fn.dict[tab].projectsHandle.ready()){
                //console.log( tab+': updating projects' );
                if( tab !== 'actions' ){
                    const future = ( tab === 'future' );
                    fn.addProjects( 
                        tab,
                        future,
                        Projects.find({ select_order: { $gt: 0 }, future: future }).fetch());
                }
                fn.dict[tab].projectsShown.set( true );
        }
    });
    // display actions when they are available and the projects have been shown
    //  the method takes care of displaying them depending of the current tab
    //  idem: update the actions
    this.autorun(() => {
        const tab = this.data.tab;
        if( tab &&
            fn.dict[tab].actionsHandle.ready() &&
            fn.dict[tab].projectsShown.get()){
                //console.log( tab+': updating actions' );
                fn.addActions( tab, Actions.find().fetch());
        }
    });
    // on action or project update, the new status of the updated item is reactively
    //  updated on the ad-hoc tree. Contrarily, the old status must be manually removed
    this.autorun(() => {
        const update = Session.get( 'process.obsolete.obj' );
        if( update && update.changes ){
            for( var i=0 ; i<update.changes.length ; ++i ){
                switch( update.changes[i].data ){
                    case 'future':
                        fn.obsoleteFuture( update.changes[i].value, update.id );
                        break;
                    case 'project':
                        fn.obsoleteParent( update.changes[i].value, update.id );
                        break;
                }
            }
        }
        Session.set( 'process.obsolete.obj', null );
    });
});

Template.projects_tree.events({
    'change .js-done'( ev, instance ){
        const tab = $( ev.currentTarget ).parent('.btns').prev('.tree').data('tab');
        const checked = instance.$('.js-done' ).is(':checked');
        Template.projects_tree.fn.displayDone( tab, checked );
    },
    'click .js-dump'( ev, instance ){
        const tab = $( ev.currentTarget ).parent('.btns').prev('.tree').data('tab');
        Template.projects_tree.fn.dumpTree( tab );
        Template.projects_tree.fn.dumpHtml( tab );
    },
    // moving a mode means both reparenting and reordering it 
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
        const method = obj.type === 'A' ? 'actions.project' : 'projects.parent';
        Meteor.call( method, obj._id, ev.move_info.target_node.id, ( error ) => {
            if( error ){
                return throwError({ message: error.message });
            }
        });
        ev.move_info.do_move();
        const $tree = $( ev.target );
        const tab = $tree.data( 'tab' );
        const json = Template.projects_tree.fn.jsonFilter( $tree.tree( 'toJson' ));
        Meteor.call( 'counters.setValue', 'tree_'+tab, json, ( error ) => {
            if( error ){
                return throwError({ message: error.message });
            }
        });
    }
});