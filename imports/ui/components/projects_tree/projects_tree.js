/*
 * 'projects_tree' component.
 *  Display and manage the projects hierary tree.
 *  Parameters:
 *  - tabid: the identifier of the created instance (may not be the one currently shown)
 *  - label: the label to be displayed as the root node.
 */
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Actions } from '/imports/api/collections/actions/actions.js';
import { Projects } from '/imports/api/collections/projects/projects.js';
import 'jqtree';
import './projects_tree.html';

Template.projects_tree.fn = {
    classes: null,
    dict: null,
    tabs: null,
    addNode: function( tabid, node ){
        const instance = Template.instance();
        if( !instance.view.isRendered ){
            //console.log( tabid+': addNode while not rendered' );
        } else {
            const $tree = instance.$('.projects-tree');
            if( !$tree ){
                //console.log( tabid+': addNode while $tree not built' );
            } else {
                if( node.id === 'root' ){
                    //console.log( 'appending root node' );
                    $tree.tree( 'appendNode', node );
                } else {
                    let existing = $tree.tree( 'getNodeById', node.id );
                    if( existing ){
                        $tree.tree( 'updateNode', existing, node )
                    } else {
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
                    }
                }
                //console.log( tabid+': addNode '+node.name );
            }
        }
    },
    addActions: function( tabid ){
        if( !Template.projects_tree.fn.dict.get( tabid+'.projects.shown' )){
            //console.log( tabid+': addActions while projects are not shown' );
        } else {
            const pNone = Projects.findOne({ code: 'non' });
            Actions.find().fetch().forEach(( item => {
                //console.log( tabid+': addActions '+item.name );
                let node = {
                    id: item._id,
                    name: item.name,
                    obj: item
                }
                node.obj.type = 'A';
                // on projects tab, attach to each project their relative actions
                if( tabid === 'projects' ){
                    if( item.project && item.project !== pNone._id ){
                        const p = Projects.findOne({ _id: item.project });
                        if( p && !p.future ){
                            node.parent = item.project;
                            Template.projects_tree.fn.addNode( tabid, node );
                        }
                    }
                // on actions tab, display actions without a project
                } else if( tabid === 'actions' ){
                    if( !item.project || item.project === pNone._id ){
                        Template.projects_tree.fn.addNode( tabid, node );
                    }
                // last display on future tab the actions attached to a future project
                } else if( tabid === 'future' ){
                    if( item.project && item.project !== pNone._id ){
                        const p = Projects.findOne({ _id: item.project });
                        if( p && p.future ){
                            node.parent = item.project;
                            Template.projects_tree.fn.addNode( tabid, node );
                        }
                    }
                } else {
                    throwError({ message: 'unknown tabid='+tabid });
                }
            }));
        }
    },
    addProjects: function( tabid ){
        if( !Template.projects_tree.fn.dict.get( tabid+'.root.set' )){
            //console.log( tabid+': addProjects while root not set' );
        } else if( tabid != 'actions'){
            const future = ( tabid === 'future' );
            Projects.find({ select_order: { $gt: 0 }, future: future }).fetch().forEach(( item => {
                //console.log( tabid+': addProjects '+item.name );
                let node = {
                    id: item._id,
                    name:  item.name,
                    obj: item
                    }
                node.obj.type = 'P';
                Template.projects_tree.fn.addNode( tabid, node );
            }));
        }
    },
    setRootNode: function( tabid, label ){
        const root = {
            id: 'root',
            name: label,
            obj: {
                type: 'R'
            }
        }
        Template.projects_tree.fn.addNode( tabid, root );
        Template.projects_tree.fn.dict.set( tabid+'.root.set', true );
    },
    // this object has changed enough to get a new place somewhere in the trees
    // the tree which holds the previous place has to be refreshed
    updateTree: function( obj ){
        const keys = Object.keys( Template.projects_tree.fn.tabs );
        for( var i=0 ; i<keys.length ; ++i ){
            const $tree = Template.projects_tree.fn.tabs[keys[i]]
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
    //console.log( this.data.tabid+': onCreated' );
    // create a new global ReactiveDict
    Template.projects_tree.fn.tabs = {};
    Template.projects_tree.fn.dict = new ReactiveDict();
    const items = Template.projects_classes.fn.classes;
    Template.projects_tree.fn.classes = items;
    for( var i=0 ; i<items.length ; ++i ){
        Template.projects_tree.fn.dict.set( items[i]+'.projects.shown', false );
        Template.projects_tree.fn.dict.set( items[i]+'.root.set', false );
    }
    // subscribe to projects and display them
    this.autorun(() => {
        let handle = this.subscribe('projects.all');
        if( handle.ready()){
            const tabid = this.data.tabid;
            //console.log( tabid+': projects subscription ready' );
            Template.projects_tree.fn.addProjects( tabid );
            Template.projects_tree.fn.dict.set( tabid+'.projects.shown', true );
        }
    });
    // subscribe to actions and display them
    this.autorun(() => {
        let handle = this.subscribe('actions.all');
        if( handle.ready()){
            const tabid = this.data.tabid;
            //console.log( tabid+': projects subscription ready' );
            Template.projects_tree.fn.addActions( tabid );
        }
    });
});

// initialize an empty tree, as the projects datas are not yet available
Template.projects_tree.onRendered( function(){
    const tabid = this.data.tabid;
    const $tree = Template.instance().$('.projects-tree');
    $tree.tree({
        autoOpen: true,
        dragAndDrop: true,
        saveState: 'ronin-projects-tree-'+tabid,
        closedIcon: $('<i class="fas fa-plus"></i>'),
        openedIcon: $('<i class="fas fa-minus"></i>'),
        onCreateLi: function( node, $li, isSelected ){
            // Add 'icon' span before title
            const icon = ( node.obj && node.obj.type === 'A' ) ? 'fa-radiation-alt' : 'fa-folder-open';
            $li.find('.jqtree-title').before('<span class="fas '+icon+' icon"></span>');
        }
    });
    Template.projects_tree.fn.tabs[tabid] = $tree;
    Template.projects_tree.fn.setRootNode( tabid, this.data.label );
});

Template.projects_tree.helpers({
});

Template.projects_tree.events({
    'tree.select .projects-tree'( event ){
        const obj = event.node ? event.node.obj : null;
        if( obj && obj.type === 'A' ){
            obj.initial_status = obj.status;
        }
        Session.set('review.projects.obj', obj );
    }
});
