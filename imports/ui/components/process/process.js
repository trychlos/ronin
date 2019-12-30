/*
 * 'process' component.
 *  This is the main component of the thoughts processing.
 *  It itself embeds five sub-components:
 *  - thoughts_badge
 *  - thoughts_list
 *  - to_action
 *  - to_project
 *  - to__maybe.
 * 
 *  Session variables:
 *  - review.process.split: height of the splitter
 *  - process.thoughts.num: number counted from 1 of the currently processed thought
 *  - process.thoughts.split: height of the top panel
 */
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Actions } from '/imports/api/collections/actions/actions.js';
import { ActionStatus } from '/imports/api/collections/action_status/action_status.js';
import { Contexts } from '/imports/api/collections/contexts/contexts.js';
import { Projects } from '/imports/api/collections/projects/projects.js';
import { Thoughts } from '/imports/api/collections/thoughts/thoughts.js';
import { Topics } from '/imports/api/collections/topics/topics.js';
import '/imports/ui/components/process_scroll/process_scroll.js';
import '/imports/ui/components/process_dispatch/process_dispatch.js';
import './process.html';

Template.process.fn = {
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

Template.process.onCreated( function(){
    Meteor.subscribe('actions.all');
    Meteor.subscribe('action_status.all');
    Meteor.subscribe('contexts.all');
    Meteor.subscribe('projects.all');
    Meteor.subscribe('thoughts.all');
    Meteor.subscribe('topics.all');
});

Template.process.onRendered( function(){
    let height = Session.get('review.process.split');
    if( !( height > 0 )){
        height = '30%';
    }
    this.$('.splitter').jqxSplitter({
        orientation: 'horizontal',
        width: '100%',
        height: '700px',
        panels: [{
            size: height,
            collapsible: false
        }]
    });
    this.$('.splitter').on('resize', function( event ){
        const height = event.args.panels[0].size;
        Session.set( 'review.process.split', height );
    });
});

Template.process.helpers({
    // an array (aka a cursor) which contains only one element
    thought_byNum(){
        var num = Session.get('process.thoughts.num');
        var o = Thoughts.findOne({}, { sort: { createdAt: 1 }, skip: num-1 });
        return Array(o);
    },
});
