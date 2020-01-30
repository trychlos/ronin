/*
 * 'thoughts_list_card' component.
 *  Open the thought card.
 *
 *  Parameters:
 *  - thought: the thought to be edited.
 */
import bootbox from 'bootbox/dist/bootbox.all.min.js';
import { Articles } from '/imports/api/collections/articles/articles.js';
import './thoughts_list_card.html';

Template.thoughts_list_card.helpers({
    // if the window is not wide enough to display the update date in the header,
    //  then display it now
    classCreatedAt(){
        return $(window).innerWidth() <= 480 ? '' : 'x-hidden';
    }
});

Template.thoughts_list_card.events({
    'click .js-edit'( event, instance ){
        Session.set( 'collect.thought', instance.data.thought );
        FlowRouter.go( 'collect.edit' );
        return false;
    },
    'click .js-action'( event, instance ){

    },
    'click .js-project'( event, instance ){

    },
    'click .js-maybe'( event, instance ){

    },
    'click .js-delete'( event, instance ){
        const thought = instance.data.thought;
        bootbox.confirm(
            'You are about to delete the "'+thought.name+'" thought.<br />'+
            'Are you sure ?', function( ret ){
                if( ret ){
                    Meteor.call( 'thoughts.remove', thought._id, ( e, res ) => {
                        if( e ){
                            throwError({ type:e.error, message: e.reason });
                            return false;
                        }
                        throwSuccess( 'Thought successfully deleted' );
                    });
                }
            }
        );
    }
});
