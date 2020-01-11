/*
 * 'menu_item' template.
 *  Display the item and its menu hierarchy.
 *
 *  Parameters:
 *  - item: an item from gtd.features()
 *  - type: 'side'|'bar'.
 */
import { gtd } from '/imports/client/interfaces/gtd/gtd.js';
import './menu_item.html';

Template.menu_item.helpers({
    isVisible( item, type ){
        return gtd.isVisible( item, type );
    },
    // have a div, maybe an anchor, and the label
    itemHtml( item, type ){
        let htmlBegin = '';
        let htmlEnd = '';
        htmlBegin += '<div';
        let classes = gtd.classes( item, type );
        if( classes.length ){
            htmlBegin += ' class="'+classes.join(' ')+'"';
        }
        htmlBegin += '>';
        htmlEnd = '</div>'+htmlEnd;
        if( item.router ){
            htmlBegin += '<a href="#" data-router="'+item.router+'">';
            htmlEnd = '</a>'+htmlEnd;
        }
        return htmlBegin+gtd.label( item, type )+htmlEnd;
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
