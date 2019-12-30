/*
 * 'thoughts_badge' component.
 *  Display the number of the currently processed thought, along with the total
 *  count of the remaining (still unprocessed) thoughts.
 *
 *  NB: relies on the main page having subscribed to 'thoughts.all'
 */
import { Meteor } from 'meteor/meteor';
import { Thoughts } from '/imports/api/collections/thoughts/thoughts.js';
import './thoughts_badge.html';

Template.thoughts_badge.fn = {
    thoughtsCount: function(){
        return Thoughts.find().count();
    }
};

Template.thoughts_badge.onRendered( function(){
});
  
Template.thoughts_badge.helpers({
    thoughtNum(){
        var num = Session.get('process.thoughts.num');
        if( !num && Template.process.fn.thoughtsCount() > 0 ){
            num = 1;
            Session.set('process.thoughts.num',num);
        }
        return num;
    },
    thoughtsCount(){
        return Template.thoughts_badge.fn.thoughtsCount();
    },
});
