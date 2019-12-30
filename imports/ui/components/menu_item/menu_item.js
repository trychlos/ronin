/*
 * 'menu_item' template.
 *  Display the item and its menu hierarchy.
 *  Parameters:
 *  - type: 'side'|'bar'
 *  - item: an item from gtdFeatures().
 */
import { gtd } from '/imports/ui/interfaces/gtd/gtd.js';
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
        if( item.router ){
            htmlBegin += '<a href="#" data-router="'+item.router+'">';
            htmlEnd = '</a>'+htmlEnd;
        }
        return htmlBegin+gtd.label( type, item )+htmlEnd;
    },
    hasChildren( item ){
        return gtd.hasChildren( item );
    }
});

Template.menu_item.events({
    'click .menu-item a'(event, instance){
        const target = event.target;
        const router = target.dataset.router;
        if( typeof router === 'undefined' ){
            console.log( 'router is undefined' );
            return true;
        }
        event.preventDefault();
        FlowRouter.go( router );
        return false;
    },
});
