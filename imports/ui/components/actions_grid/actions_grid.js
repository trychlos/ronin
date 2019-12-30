/*
 * 'actions_grid' component.
 *  Display the specified list of priority values:
 *  Parameters:
 *  - status: the status of the actions to be displayed.
 */
import { Meteor } from 'meteor/meteor';
import { Actions } from '/imports/api/collections/actions/actions.js';
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import { Projects } from '/imports/api/collections/projects/projects.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/ui/components/action_nmw_edit/action_nmw_edit.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/styles/jqx.base.css';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxcore.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxbuttons.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxdata.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxdropdownlist.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxgrid.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxgrid.edit.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxgrid.columnsresize.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxgrid.filter.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxgrid.grouping.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxgrid.pager.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxgrid.selection.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxgrid.sort.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxgrid.storage.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxlistbox.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxmenu.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxscrollbar.js';
import './actions_grid.html';

Template.actions_grid.fn = {
    centerHeader: function( value ){
        return '<div style="text-align:center; padding-top:8px">'+value+'</div>';
    }
};

Template.actions_grid.onRendered( function(){
    this.$('.actions-grid').jqxGrid({
        columns: [
            { text: 'Name', datafield: 'name', width: 200, resizable: true },
            { text: 'Context', datafield: 'context', width: 200, resizable: true },
            { text: 'Topic', datafield: 'topic', width: 200, resizable: true },
            { text: 'Creation', datafield: 'createdAt', width: 80, resizable: true, cellsformat: 'dd/MM/yyyy', cellsalign: 'center', renderer: Template.actions_grid.fn.centerHeader },
            { text: 'Start Date', datafield: 'startDate', width: 80, resizable: true, cellsformat: 'dd/MM/yyyy', cellsalign: 'center', renderer: Template.actions_grid.fn.centerHeader },
            { text: 'Due Date', datafield: 'dueDate', width: 80, resizable: true, cellsformat: 'dd/MM/yyyy', cellsalign: 'center', renderer: Template.actions_grid.fn.centerHeader },
            { text: 'Done Date', datafield: 'doneDate', width: 80, resizable: true, cellsformat: 'dd/MM/yyyy', cellsalign: 'center', renderer: Template.actions_grid.fn.centerHeader }
        ],
        width: '100%',
        columnsresize: true,
        autoloadstate: true,
        autosavestate: true,
        autoheight: true
    });
    this.$('.actions-grid').bind('rowselect', function( event ){
        const args = event.args;
        if( args ){
            const index = args.index;
            const id = $('.actions-grid').jqxGrid('getrowid',index );
            if( id ){
                Session.set( 'action.edit.obj', Actions.findOne({ _id: id }));
                Blaze.render(Template.action_nmw_edit, document.body);
            }
        }
    });
    this.autorun(() => {
        if( Session.get( 'review.actions.areReady')){
            const data = Template.currentData();
            if( data ){
                Actions.find({ status: data.status }, { sort:{ createdAt: -1 }}).fetch().forEach( it => {
                    const context = Contexts.findOne({ _id: it.context });
                    const project = Projects.findOne({ _id: it.project });
                    const topic = Topics.findOne({ _id: it.topic });
                    this.$('.actions-grid').jqxGrid( 'addRow', it._id, {
                        name: it.name,
                        context: context.name,
                        project: project.name,
                        topic: topic.name,
                        createdAt: it.createdAt,
                        startDate: it.startDate,
                        dueDate: it.dueDate,
                        doneDate: it.doneDate
                    }, 'last' );
                });
            }
        }
    });
});

Template.actions_grid.helpers({
    cursor( status ){
        return Actions.find({ status: status });
    },
});

Template.actions_grid.events({
});
