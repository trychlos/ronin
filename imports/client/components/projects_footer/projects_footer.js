/*
 * 'projects_footer' component.
 *
 *  Create a sticky footer in page layout.
 *
 * Parameters:
 * - actionNew: the activable action associated to the New button.
 */
import '/imports/client/components/projects_tabs/projects_tabs.js';
import './projects_footer.html';

Template.projects_footer.fn = {
    // the action passed in the data context may be an Action object instance
    //  or a function which is expected to return this Action object instance.
    action( data ){
        return data && data.actionNew ?
            ( typeof data.actionNew === 'function' ? data.actionNew() : data.actionNew ) : null;
    }
};

Template.projects_footer.helpers({
    // class helper: display only in development environment
    develClass(){
        return Meteor.isDevelopment ? '' : 'x-hidden';
    },
    // class helper
    enabledClass(){
        const action = Template.projects_footer.fn.action( this );
        return action ? ( action.activable() ? '' : 'ui-state-disabled' ) : 'ui-state-disabled';
    },
    // class helper: only display icons on small widths
    widthClass(){
        return Ronin.ui.runWidth() < 400 ? 'x-with-icon': 'x-with-label';
    }
});

Template.projects_footer.events({
    'click .js-new'( ev, instance ){
        const action = Template.projects_footer.fn.action( instance.data );
        if( action ){
            action.activate();
            return false;
        }
    }
});
