/*
 * 'projects_select' component.
 *  Display a drop-down box to select a project,
 *  maybe giving an initial value as 'selected=_id' parm.
 */
import { Meteor } from 'meteor/meteor';
import { Articles } from '/imports/api/collections/articles/articles.js';
import './projects_select.html';

Template.projects_select.fn = {
    // return the identifier of the selected project
    getSelected: function( $parent ){
        return $( $parent.find( '.projects-select .js-select option:selected' )[0] ).val();
    },
    // select a value
    setSelected: function( $parent, value ){
        $( $parent.find( '.projects-select .js-select' )[0] ).val( value );
    },
    // select the default value
    selectDefault: function( $parent ){
        Template.projects_select.fn.setSelected( $parent, 'none' );
    }
};

Template.projects_select.onCreated( function(){
    this.subscribe( 'articles.projects.all' );
});

Template.projects_select.helpers({
    // project is the id of the project to be selected
    isSelected( current, selected ){
        //console.log( 'project_selected: project='+project+' current='+current.name+' (id='+current._id+')' );
        var value = "";
        if( selected && selected === current._id ){
            value = 'selected';
            //console.log( 'project_selected: found project='+current.name );
        }
        return value;
    },
    projects(){
        return Articles.find({ type:'P' }, { sort:{ select_order:1, name:1 }});
    }
});
