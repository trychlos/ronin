/*
 * 'thoughts_list' component.
 *  Display the specified list of thoughts, giving a cursor (aka an array)
 *
 *  Parameters:
 *  - thoughts: the cursor (aka an array) to be displayed
 *  - title: true|false whether to display the title
 *  - editable: whether the items are editable/deletable;
 *      apply to each and every item of the cursor as a whole;
 *      defaults to true
 *
 *  NB: this component is used both as a reminder when collecting new thoughts,
 *      and as a dispatcher when processing thoughts.
 */
import { Articles } from '/imports/api/collections/articles/articles.js';
import '/imports/client/components/thoughts_list_item/thoughts_list_item.js';
import './thoughts_list.html';

Template.thoughts_list.helpers({
    // on smartphone, only two columns are displayed -> 7-4-1
    // on wider screens, three columns are displayed -> 5-3-3-1
    colclassCreatedAt(){
        return $(window).innerWidth()<481 ? 'x-hidew480' : 'col-3';
    },
    colclassName(){
        return $(window).innerWidth()<481 ? 'col-6' : 'col-5';
    },
    colclassTopic(){
        return $(window).innerWidth()<481 ? 'col-4' : 'col-3';
    },
    lineHeight(){
        return g.run.layout.get() === LYT_TOUCH ? 'x-trh3' : '';
    }
});

Template.thoughts_list.events({
    // a collapsable item is opened
    // close the previously opened item
    'show.bs.collapse.ronin'( event, instance ){
        $( '.thoughts-list-item' ).removeClass( 'opened-card' );
    },
    // target=[object SVGSVGElement] but may also be SVGPathElement
    'click .js-delete'( event, instance ){
        event.preventDefault();
        const button = $( event.target ).parents( 'button' )[0];
        const id = $( button ).data( 'thought' );
        //console.log( "deleting id='"+anchor.id+"'");
        Meteor.call('thoughts.remove', id, ( error ) => {
            if( error ){
                return throwError({ message: error.message });
            }
        });
        return false;
    },
    'click .js-update'( event, instance ){
        event.preventDefault();
        const button = $( event.target ).parents( 'button' )[0];
        const id = $( button ).data( 'thought' );
        const obj = Thoughts.findOne({ _id: id });
        if( !obj ){
            throwError({ message: 'Thought no more exists' });
        } else {
            Session.set( 'collect.thought', obj );
        }
        return false;
    },
});
