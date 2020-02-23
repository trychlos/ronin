/*
 * 'menu_button' template.
 *
 *  Display a button on the left of the navbar to open the menu.
 */
import './menu_button.html';

Template.menu_button.events({
    'click .js-about'( ev, instance ){
        bootbox.alert({
            message: "This alert can be dismissed by clicking on the background!",
            backdrop: true
        });
    }
});
