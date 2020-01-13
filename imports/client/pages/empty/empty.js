/*
 * 'empty' page.
 */
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import './empty.html';

Template.empty.onRendered( function(){
    $(this).IWindowed( 'minimizeAll' );
});
