/*
 * 'menu_item' template.
 *  Display the item and its menu hierarchy.
 *
 *  Parameters:
 *  - item: an item from gtd.features()
 *  - type: footer|header|overview|side (cf. gtd.js)
 */
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import './menu_item.html';

Template.menu_item.helpers({
    // template helper
    //  whether this item is activable
    isActivable( type, item ){
        return gtd.isActivableItem( item );
    },
    // template helper
    //  whether this item is to be displayed in this navigation menu (resp. tabs page)
    isVisible( type, item ){
        return gtd.isVisible( type, item );
    },
    // class helper
    itemClasses( type, item ){
        return gtd.classesItem( item ).join(' ');
    },
    // template helper
    //  attach each item to its gtd group
    itemGroup( type, item ){
        return gtd.groupId( item.id );
    },
    // template helper
    //  returns the item label
    itemLabel( type, item ){
        return gtd.labelItem( type, item );
    },
    link( type, item ){
        return '<a href="javascript:void(0);" data-ronin-gtdid="'+item.id+'">'+gtd.labelItem( type, item )+'</a>';
    }
});

Template.menu_item.events({
    'click .menu-item a'( ev, instance ){
        gtd.activateId( $( ev.target ).attr( 'data-ronin-gtdid' ));
        return false;
    },
});
