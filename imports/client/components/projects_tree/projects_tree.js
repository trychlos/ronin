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
import 'jqtree';
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
                throwError({ message: 'unknown tab='+tab });
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
    addProjects: function( tab, fetched ){
        const $tree = Template.projects_tree.fn.dict[tab] ? Template.projects_tree.fn.dict[tab].tree : null;
        if( !$tree ){
            console.log( tab+': addProjects while $tree not built' );
            return;
        }
        fetched.forEach(( it => {
            //console.log( tab+': addProjects '+item.name );
            let node = {
                id: it._id,
                name:  it.name,
                obj: it
            };
            node.obj.type = 'P';
            Template.projects_tree.fn.addNode( $tree, node );
        }));
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
    // returns the ad-hoc icon class if the action is activable
    getIconClass: function( node ){
        return node && node.obj && node.obj.type === 'A' ?
            ( node.obj.status === 'don' ? 'rev-status-done' :
                ( node.obj.status !== 'ina' ? 'rev-status-activable' : '' )) : '';
    },
    // returns the appliable icon
    getIconName: function( node ){
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
        let obj = { id: it.id };
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
                            console.log( 'click' );
                            $( this ).dialog( 'close' );
                    }}
                ],
                modal: true,
                resizable: false,
                title: 'Confirmation requested',
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
            projectsHandle: this.subscribe('projects.all'),
            projectsShown:  new ReactiveVar( false ),
            tree:           null
        }
    }
});

Template.projects_tree.onRendered( function(){
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
                const icon = Template.projects_tree.fn.getIconName( node );
                const classe = Template.projects_tree.fn.getIconClass( node );
                $li.find('.jqtree-title').before('<span class="fas '+icon+' '+classe+' icon"></span>');
                $li.attr('data-pwi-nodeid', node.id);
            }
        });
        Template.projects_tree.fn.dict[tab].tree = $tree;
        Template.projects_tree.fn.setRootNode( tab, this.data.label );
        // define the context menu
        $tree.contextMenu({
            selector: 'li.jqtree_common span.jqtree-title',
            items: {
                edit: {
                    name: 'Edit',
                    icon: 'fas fa-edit'
                },
                delete: {
                    name: 'Delete',
                    icon: 'fas fa-trash-alt'
                }
            },
            autoHide: true,
            callback: function( item, opt ){
                // opt: menu object
                // opt.context: DIV.tree element
                // opt.$trigger: SPAN.jqtree-title.jqtree_common element
                const li = $(opt.$trigger).parents('li')[0];
                const $li = $(li);
                const node = $li.data( 'node' );
                if( node.id !== 'root' ){
                    switch( item ){
                        case 'edit':
                            Template.projects_tree.fn.opeEdit( tab, node );
                            break;
                        case 'delete':
                            Template.projects_tree.fn.opeDelete( tab, node );
                            break;
                    }
                }
            },
            events: {
                show: function( opts ){
                    this.addClass( 'contextmenu-showing' );
                },
                hide: function( opts ){
                    this.removeClass( 'contextmenu-showing' );
                }
            },
            position: function( opt, x, y ){
                // opt: menu object
                opt.$menu.position({
                    my: 'left top',
                    at: 'right bottom',
                    of: opt.$trigger
                });
            }
        });
    }
    // display projects when they are available
    //  the method takes care of displaying them depending of the current tab
    //  also update the projects
    this.autorun(() => {
        const tab = this.data.tab;
        if( tab &&
            Template.projects_tree.fn.dict[tab].projectsHandle.ready()){
                //console.log( tab+': updating projects' );
                if( tab !== 'actions' ){
                    const future = ( tab === 'future' );
                    Template.projects_tree.fn.addProjects( 
                        tab,
                        Projects.find({ select_order: { $gt: 0 }, future: future }).fetch());
                }
                Template.projects_tree.fn.dict[tab].projectsShown.set( true );
        }
    });
    // display actions when they are available and the projects have been shown
    //  the method takes care of displaying them depending of the current tab
    //  idem: update the actions
    this.autorun(() => {
        const tab = this.data.tab;
        if( tab &&
            Template.projects_tree.fn.dict[tab].actionsHandle.ready() &&
            Template.projects_tree.fn.dict[tab].projectsShown.get()){
                //console.log( tab+': updating actions' );
                Template.projects_tree.fn.addActions( tab, Actions.find().fetch());
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
                        Template.projects_tree.fn.obsoleteFuture( update.changes[i].value, update.id );
                        break;
                    case 'project':
                        Template.projects_tree.fn.obsoleteParent( update.changes[i].value, update.id );
                        break;
                }
            }
        }
        Session.set( 'process.obsolete.obj', null );
    });
});

Template.projects_tree.events({
    'click .js-dump'( ev, instance ){
        const tab = $( ev.currentTarget ).parent('.btns').prev('.tree').data('tab');
        Template.projects_tree.fn.dumpTree( tab );
        Template.projects_tree.fn.dumpHtml( tab );
    },
    // moving a mode means both reparenting and reordering it 
    'tree.move .projects-tree .tree'( ev ){
        //console.log( 'ev ', ev );
        //console.log( 'moved_node', ev.move_info.moved_node );
        //console.log('target_node', ev.move_info.target_node);
        //console.log('position', ev.move_info.position);
        //console.log('previous_parent', ev.move_info.previous_parent);
        const obj = ev.move_info.moved_node.obj;
        const method = obj.type === 'A' ? 'actions.project' : 'projects.parent';
        Meteor.call( method, obj._id, ev.move_info.target_node.id, ( error ) => {
            if( error ){
                return throwError({ message: error.message });
            }
        });
        const $tree = $( ev.target );
        const tab = $tree.data( 'tab' );
        const json = Template.projects_tree.fn.jsonFilter( $tree.tree( 'toJson' ));
        Meteor.call( 'counters.setValue', 'tree_'+tab, json, ( error ) => {
            if( error ){
                return throwError({ message: error.message });
            }
        });
}
    /*
    'tree.contextmenu .projects-tree .tree'( ev ){
        // ev.target = ev.currentTarget = the div.tree element
        // ev.node is the tree node
        // ev.node.element is the li element
        const $li = $( ev.node.element );
        $li.contextMenu();
    }
    */
    /*
    'tree.select .projects-tree .tree'( event ){
        const obj = event.node ? event.node.obj : null;
        if( obj && obj.type === 'A' ){
            obj.initial_status = obj.status;
        }
        Session.set('process.edit.obj', obj );
    }
    */
});
