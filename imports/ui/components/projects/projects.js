/*
 * 'projects' component.
 *  This is the main component of the 'projectsPage' page.
 *  It itself embeds following sub-components:
 *  - projects_classes
 *  - project_edit.
 *  Session variables:
 *  - 'review.projects.tab': holds the name of the current tab
 *  - 'review.projects.split': the width of the left pane
 *  - 'review.projects.obj': the currently edited project
 */
import { Meteor } from 'meteor/meteor';
import '/imports/ui/third-party/jqwidgets/jqwidgets/styles/jqx.base.css';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxcore.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxbuttons.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxsplitter.js';
import '/imports/ui/components/details/details.js';
import '/imports/ui/components/projects_classes/projects_classes.js';
import './projects.html';

Template.projects.onRendered( function(){
    let width = Session.get('review.projects.split');
    if( !( width > 0 )){
        width = '30%';
    }
    this.$('.splitter').jqxSplitter({
        orientation: 'vertical',
        width: '99%',
        height: '700px',
        panels: [{
            size: width,
            collapsible: false
        }]
    });
    this.$('.splitter').on('resize', function( event ){
        const width = event.args.panels[0].size;
        Session.set( 'review.projects.split', width );
    });
});
