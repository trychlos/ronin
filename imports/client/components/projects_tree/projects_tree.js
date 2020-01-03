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
        fetched.forEach(( it => {
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
        }));
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
            return;
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
    // returns the ad-hox class if the action is activable
    getClass: function( node ){
        return node && node.obj && node.obj.type === 'A' ?
            ( node.obj.status === 'don' ? 'rev-status-done' :
                ( node.obj.status !== 'ina' ? 'rev-status-activable' : '' )) : '';
    },
    // returns the appliable icon
    getIcon: function( node ){
        return node && node.obj && node.obj.type === 'A' ? 'fa-radiation-alt' : 'fa-folder-open';
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
    },
    // this object has changed enough to get a new place somewhere in the trees
    // the tree which holds the previous place has to be refreshed
    updateTree: function( obj ){
        const tabs = Object.keys( Template.projects_tree.fn.dict );
        for( var i=0 ; i<tabs.length ; ++i ){
            const $tree = Template.projects_tree.fn.dict[tabs[i]]
            let found = $tree.tree( 'getNodeById', obj._id );
            if( found ){
                //console.log( obj.name+' node found' );
                $tree.tree( 'removeNode', found );
                break;
            }
        }
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
                const icon = Template.projects_tree.fn.getIcon( node );
                const classe = Template.projects_tree.fn.getClass( node );
                $li.find('.jqtree-title').before('<span class="fas '+icon+' '+classe+' icon"></span>');
            }
        });
        Template.projects_tree.fn.dict[tab].tree = $tree;
        Template.projects_tree.fn.setRootNode( tab, this.data.label );
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
});

Template.projects_tree.events({
    'click .js-dump'( ev, instance ){
        const tab = $( ev.currentTarget ).parent('.btns').prev('.tree').data('tab');
        Template.projects_tree.fn.dumpTree( tab );
        Template.projects_tree.fn.dumpHtml( tab );
    },
    'tree.select .projects-tree .tree'( event ){
        const obj = event.node ? event.node.obj : null;
        if( obj && obj.type === 'A' ){
            obj.initial_status = obj.status;
        }
        Session.set('review.detail.obj', obj );
    }
});
