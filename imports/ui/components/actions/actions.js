/*
 * 'actions' component.
 *  This is the main component of the 'actionsPage' page.
 *  It itself embeds following sub-components:
 *  - actions_classes.
 *  Session variables:
 *  - 'review.actions.tab': holds the name of the current tab
 *  - 'review.actions.split': the width of the left pane
 *  - 'review.actions.obj': the currently edited project
 */
import { Meteor } from 'meteor/meteor';
import '/imports/ui/third-party/jqwidgets/jqwidgets/styles/jqx.base.css';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxcore.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxbuttons.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxsplitter.js';
import '/imports/ui/components/actions_classes/actions_classes.js';
import './actions.html';

Template.actions.onRendered( function(){
    let width = Session.get('review.actions.split');
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
        Session.set( 'review.actions.split', width );
    });
});
