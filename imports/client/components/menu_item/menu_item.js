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
    isVisible( type, item ){
        return gtd.isVisible( type, item );
    },
    // have a div, maybe an anchor, and the label
    itemHtml( type, item ){
        let htmlBegin = '';
        let htmlEnd = '';
        htmlBegin += '<div';
        let classes = gtd.classes( type, item );
        if( classes.length ){
            htmlBegin += ' class="'+classes.join(' ')+'"';
        }
        htmlBegin += '>';
        htmlEnd = '</div>'+htmlEnd;
        if( gtd.routeItem( type, item )){
            htmlBegin += '<a href="#" data-ronin-gtdid="'+item.id+'">';
            htmlEnd = '</a>'+htmlEnd;
        }
        return htmlBegin+gtd.labelItem( type, item )+htmlEnd;
    },
    hasChildren( item ){
        return gtd.hasChildren( item );
    }
});

Template.menu_item.events({
    'click .menu-item a'( ev, instance ){
        const id = $( ev.target ).data( 'ronin-gtdid' );
        const name = instance.data.type;
        const route = gtd.routeId( name, id );
        if( route ){
            FlowRouter.go( route );
        } else {
            console.log( 'route is undefined' );
        }
        return false;
    },
});
