/*
 * 'edit_button' template.
 *
 *  Edit the item.
 *
 *  Parameters:
 *  - item: the article to be edited
 *  - disabled: 'disabled' if the button is to be disabled
 *      default is to enable the button
 *  - route: the route to be used for editing the item
 *      default is to rely on Article type.
 */
import './edit_button.html';

Template.edit_button.helpers({
    // class helper
    disabled(){
        return this.disabled === 'disabled' ? 'ui-state-disabled' : '';
    }
});

Template.edit_button.events({
    'click .js-edit'( event, instance ){
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
            Ronin.ui.runBack( FlowRouter.current().route.name );
            FlowRouter.go( route, null, { id:item._id });
        }
        return false;
    }
});
