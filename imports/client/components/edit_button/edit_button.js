/*
 * 'edit_button' template.
 *
 *  Edit the item.
 *
 *  Parameters:
 *  - item: the article to be edited.
 */
import './edit_button.html';

Template.edit_button.events({
    'click .js-edit'( event, instance ){
        let route = null;
        const item = instance.data.item;
        if( item ){
            switch( item.type ){
                case 'A':
                    route = 'action.edit';
                    break;
                case 'P':
                    route = 'project.edit';
                    break;
                case 'T':
                    route = 'thought.edit';
                    break;
            };
        }
        if( route ){
            g.run.back = FlowRouter.current().route.name;
            FlowRouter.go( route, null, { id:item._id });
        }
        return false;
    }
});
