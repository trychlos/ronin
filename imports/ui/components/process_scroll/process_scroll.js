/*
 * 'process_scroll' component.
 *  Scroll through the unprocessed thoughts.
 *  Parameters:
 *  - cursor: the thought indexed by the 'process.thoughts.num' session variable.
 */
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Thoughts } from '/imports/api/collections/thoughts/thoughts.js';
import '/imports/ui/components/thoughts_badge/thoughts_badge.js';
import '/imports/ui/components/thoughts_list/thoughts_list.js';
import './process_scroll.html';

Template.process_scroll.fn = {
    thoughtsCount: function(){
        return Thoughts.find().count();
    }
};

Template.process_scroll.events({
    'click .js-prev'(event){
        event.preventDefault();
        var num = Session.get('process.thoughts.num');
        num -= 1;
        if( num == 0 ){
            num = Template.process_scroll.fn.thoughtsCount();
        }
        Session.set('process.thoughts.num', num);
        //console.log( 'process.thoughts.num='+Session.get('process.thoughts.num'))
        return false;
    },
    'click .js-next'(event){
        event.preventDefault();
        var num = Session.get('process.thoughts.num');
        num += 1;
        if( num > Template.process_scroll.fn.thoughtsCount()){
            num = 1;
        }
        Session.set('process.thoughts.num', num);
        //console.log( 'process.thoughts.num='+Session.get('process.thoughts.num'))
        return false;
    },
});
