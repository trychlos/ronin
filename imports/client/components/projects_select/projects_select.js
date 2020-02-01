/*
 * 'projects_select' component.
 *  Display a drop-down box to select a project,
 *  maybe giving an initial value as 'selected=_id' parm.
 */
import { Meteor } from 'meteor/meteor';
import { Projects } from '/imports/api/collections/projects/projects.js';
import './projects_select.html';

Template.projects_select.fn = {
    // return the identifier of the selected project
    getSelected: function( selector ){
        const instance = Template.instance();
        return instance.$( selector+' .js-project option:selected' ).val();
    },
    // select the default value
    selectDefault: function(){
        const instance = Template.instance();
        if( instance.view.isRendered ){
            const obj = Projects.findOne({ default: true });
            if( obj ){
                instance.$('.js-project').val( obj._id );
            }
        }
    },
    // unselect
    unselect: function(){
        const instance = Template.instance();
        if( instance.view.isRendered ){
            instance.$('.js-project').val('');
        }
    }
};

Template.projects_select.onCreated( function(){
    this.subscribe('projects.all');
});

Template.projects_select.helpers({
    projects_cursor(){
        return Projects.find({}, { sort:{ select_order:1, name:1 }});
    },
    // project is the id of the project to be selected
    project_selected( current, selected ){
        //console.log( 'project_selected: project='+project+' current='+current.name+' (id='+current._id+')' );
        var value = "";
        if( selected && selected === current._id ){
            value = 'selected';
            //console.log( 'project_selected: found project='+current.name );
        }
        return value;
    }
});
