/*
 * 'edit_button' template.
 *
 *  Edit the item.
 *
 *  Parameters:
 * - action: may be:
 *   > an activable Action object instance
 *   > a function which returns an activable Action object instance.
 */
import './edit_button.html';

Template.edit_button.fn = {
    // the action passed in the data context may be an Action object instance
    //  or a function which is expected to return this Action object instance.
    action( data ){
        return data && data.action ? ( typeof data.action === 'function' ? data.action() : data.action ) : null;
    }
};

Template.edit_button.onRendered( function(){
    const self = this;

    this.autorun(() => {
        const action = Template.edit_button.fn.action( self.data );
        const activable = action ? action.activable() : false;
        const $button = self.$( '.js-edit-button' );
        if( activable ){
            $button.attr( 'disabled', false );
            $button.removeClass( 'ui-state-disabled' );
        } else {
            $button.attr( 'disabled', true );
            $button.addClass( 'ui-state-disabled' );
        }
    });
});

Template.edit_button.events({
    'click .js-edit-button'( event, instance ){
        const action = Template.edit_button.fn.action( instance.data );
        if( action ){
            action.activate();
            return false;
        }
        /*
        let route = instance.data.route;
        const item = instance.data.item;
        if( !route ){
            if( item ){
                switch( item.type ){
                    case 'A':
                        route = 'rt.actions.edit';
                        break;
                    case 'P':
                        route = 'rt.projects.edit';
                        break;
                    case 'T':
                        route = 'rt.thoughts.edit';
                        break;
                };
            }
        }
        if( route ){
            FlowRouter.go( route, null, { id:item._id });
        }
        return false;
        */
    }
});
