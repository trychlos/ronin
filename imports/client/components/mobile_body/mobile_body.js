/*
 * 'mobile_body' component.
 *  Display the page's content between the header and the footer.
 *
 *  Session variables:
 *  - mobile.tab.name: the identifier of the active page
 *      aka the identifier of the corresponding option in 'gtd' features.
 */
import '/imports/client/components/mobile_collect/mobile_collect.js';
import '/imports/client/components/mobile_process/mobile_process.js';
import '/imports/client/components/mobile_review/mobile_review.js';
import '/imports/client/components/mobile_setup/mobile_setup.js';
import './mobile_body.html';

Template.mobile_body.onRendered( function(){
});

Template.mobile_body.helpers({
    template(){
        const page = Session.get('mobile.tab.name');
        if( page ){
            const template = 'mobile_'+page;
            //console.log( 'loading template='+template );
            return template;
        }
    }
});
