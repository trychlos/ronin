/*
 * 'menu_side' template.
 *  Vertical menu on the (left) side of the page.
 *  Based on jQuery UI Menu widget.
 */
import { gtd } from '/imports/ui/interfaces/gtd/gtd.js';
import '/imports/ui/components/menu_item/menu_item.js';
import './menu_side.html';

Template.menu_side.helpers({
    gtdFeatures(){
        return gtd.features();
    }
});
