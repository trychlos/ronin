/*
 * 'review_ops' component.
 *  Let the user create a new project or a new action.
 * 
 *  This component is only defined because I have been unable to define working
 *  events in reviewWindow window.
 */
import '/imports/client/windows/detail_window/detail_window.js';
import './review_ops.html';

Template.review_ops.events({
    'click .js-action': function( event, instance ){
        event.preventDefault();
        const obj = {
            type: 'A',
            name: 'New action'
        };
        Session.set( 'review.detail.obj', obj );
        $('.review-window').IWindowed( 'show', 'detailWindow' );
    },
    'click .js-project': function( event ){
        event.preventDefault();
        const obj = {
            type: 'P',
            name: 'New project'
        };
        Session.set( 'review.detail.obj', obj );
        $('.review-window').IWindowed( 'show', 'detailWindow' );
    }
});
