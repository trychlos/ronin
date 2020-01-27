/*
 * 'thoughts_badge' component.
 *  Display the number of the currently processed thought, along with the total
 *  count of the remaining (still unprocessed) thoughts.
 *
 *  NB: relies on the parent having subscribed to 'thoughts.all'
 */
import { Thoughts } from '/imports/api/collections/thoughts/thoughts.js';
import './thoughts_badge.html';

Template.thoughts_badge.fn = {
    thoughtsCount: function(){
        return Thoughts.find().count();
    }
};

Template.thoughts_badge.onRendered( function(){
    if( g.run.layout.get === LYT_WINDOW ){
        $( '.thoughts_badge span.inline' ).css( 'color', 'white' );
    }
});

Template.thoughts_badge.helpers({
    thoughtNum(){
        let num = Session.get('process.thoughts.num');
        if( !num && Template.thoughts_badge.fn.thoughtsCount() > 0 ){
            num = 1;
            Session.set('process.thoughts.num',num);
        }
        return num;
    },
    thoughtsCount(){
        return Template.thoughts_badge.fn.thoughtsCount();
    },
});
