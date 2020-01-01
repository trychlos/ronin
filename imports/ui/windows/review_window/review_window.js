/*
 * 'reviewWindow' window.
 *  This is the main component for projects and actions reviewing.
 * 
 *  Session variables:
 *  - review.projects.split: the position of the vertical splitter
 */
import { Actions } from '/imports/api/collections/actions/actions.js';
import { Projects } from '/imports/api/collections/projects/projects.js';
import '/imports/ui/components/details_edit/details_edit.js';
import '/imports/ui/components/projects_tabs/projects_tabs.js';
import '/imports/ui/interfaces/iwindowed/iwindowed.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/styles/jqx.base.css';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxcore.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxbuttons.js';
import '/imports/ui/third-party/jqwidgets/jqwidgets/jqxsplitter.js';
import './review_window.html';

Template.reviewWindow.onCreated( function(){
    this.subscribe('actions.all');
    this.subscribe('projects.all');
});

Template.reviewWindow.onRendered( function(){
    this.autorun(() => {
        if( g.taskbar.get()){
            $('div.review-window').iWindowed({
                id:    'reviewWindow',
                title: 'Review, organize, do'
            });
            let pos = Session.get('review.projects.split');
            if( !( pos > 0 )){
                pos = '50%';
            }
            $('.splitter').jqxSplitter({
                orientation: 'vertical',
                width: pos,
                height: '100%',
                panels: [{
                    size: pos,
                    collapsible: false
                }]
            });
            $('.splitter').on('resize', function( event ){
                if( event.args ){
                    const pos = event.args.panels[0].size;
                    Session.set( 'review.projects.split', pos );
                }
            });
        }
    });
});
