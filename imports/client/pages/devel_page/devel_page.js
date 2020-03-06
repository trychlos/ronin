/*
 * 'develPage' page.
 *
 *  Display some base informations about the environment.
 *
 *  Test for hot-code push vs page reload variables survival:
 *  - variables are set from test-variables.js startup code
 *  - onRendered: display the variable
 *  - modify anything in the code to trigger hot-code push
 *  - reload the page and see...
 */
import './devel_page.html';

Template.develPage.onRendered( function(){
});

Template.develPage.helpers({
    hasMouse(){
        return 'detectIt hasMouse='+g.detectIt.hasMouse;
    },
    hasTouch(){
        return 'detectIt hasTouch='+g.detectIt.hasTouch;
    },
    primaryInput(){
        return 'detectIt primaryInput='+g.detectIt.primaryInput;
    },
    resolution(){
        return 'Resolution is w='+g.run.width.get()+' h='+g.run.height.get();
    }
});
