/*
 * 'processWindow' window.
 *  This is the main component of the thoughts processing.
 *
 *  This window is used both by the desktop and touch layouts, though with some
 *  differences:
 *
 *  - desktop displays all in a single page:
 *      > a scrollable part which display each thought, on the top
 *      > a tabbed part for creating project, action, or someday/maybe item
 *          on the bottom.
 *
 *  - on small touch devices, only scrollable part with three selection buttons
 *      are displayed on the page;
 *      selecting on the button triggers another page (same route) to let the
 *      user enter more informations and validate.
 *
 *    Breakpoint to display all in a single page or define these child pages is
 *    set to 800x600 viewport.
 *
 *  Session variables:
 *  - process.thoughts.num: number counted from 1 of the currently processed thought
 *  - process.thoughts.split: height of the top panel
 */
import { Actions } from '/imports/api/collections/actions/actions.js';
import { Projects } from '/imports/api/collections/projects/projects.js';
import { Thoughts } from '/imports/api/collections/thoughts/thoughts.js';
import '/imports/client/components/process_buttons/process_buttons.js';
import '/imports/client/components/process_scroll/process_scroll.js';
import '/imports/client/components/process_tabs/process_tabs.js';
import '/imports/client/interfaces/iwindowed/iwindowed.js';
/*
import '/imports/client/third-party/jqwidgets/jqxbuttons-patched.js';
import '/imports/client/third-party/jqwidgets/jqxsplitter.js';
*/
import './process_window.html';

Template.processWindow.fn = {
    // this method is to be called after having removed a thought
    //  in order to make sure a new thought is correctly loaded if
    //  appropriate
    // because the client side reactive var may not be yet updated
    //  the caller has to provide a photo of the vars before the
    //  remove operation (to be sure we work with the right values)
    thoughtRemoved: function( num, count ){
        count -= 1;
        if( count > 0 ){
            if( num > count ){
                Session.set( 'process.thoughts.num', count );
            }
        } else {
            Session.set( 'process.thoughts.num', 0 );
        }
    },
    thoughtsCount: function(){
        return Thoughts.find().count();
    }
};

Template.processWindow.onCreated( function(){
    this.subscribe('actions.all');
    this.subscribe('contexts.all');
    this.subscribe('projects.all');
    this.subscribe('thoughts.all');
    this.subscribe('topics.all');
});

Template.processWindow.onRendered( function(){
    // open the window if the manager has been intialized
    if( g[LYT_WINDOW].taskbar.get()){
        $('div.process-window').IWindowed({
            template:   'processWindow',
            title:      'Process thoughts'
        });
        /* pwi 2020- 1- 2 remove unused splitter
        let height = Session.get('process.thoughts.split');
        if( !( height > 0 )){
            height = '30%';
        }
        $('.splitter').jqxSplitter({
            orientation: 'horizontal',
            width: '100%',
            height: '430px',
            panels: [{
                size: height,
                collapsible: false
            }]
        });
        $('.splitter').on('resize', function( event ){
            if( event.args ){
                const height = event.args.panels[0].size;
                Session.set( 'process.thoughts.split', height );
            }
        });
        */
    }
});

Template.processWindow.helpers({
    // an array (aka a cursor) which contains only one element
    thought_byNum(){
        const num = Session.get('process.thoughts.num');
        const o = Thoughts.findOne({}, { sort: { createdAt: 1 }, skip: num-1 });
        return new Array(o);
    },
});
