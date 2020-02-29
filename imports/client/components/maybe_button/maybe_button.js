/*
 * 'maybe_button' template.
 *
 *  Transform a thought (resp. an action) into a maybe/someday.
 *
 *  Parameters:
 *  - item: the article to be transformed.
 */
import './maybe_button.html';

Template.maybe_button.events({
    'click .js-maybe'( event, instance ){
        g.run.back = FlowRouter.current().route.name;
        console.log( 'not implemented' );
        return false;
    }
});
