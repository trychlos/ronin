/*
 * 'processPage' page.
 *  The main page for the 'process' features group.
 *  This page, along with the corresponding windows, must be layout-agnostic.
 *
 *  Worflow:
 *  [routes.js]
 *      +-> pageLayout { gtd, page, window }
 *              +-> processPage { gtd, window }
 *
 *  Parameters:
 *  - 'gtd': the identifier of this features's group item
 *  - 'window': the window to be run
 *      here: might be collectList, collectEdit.
 */
import '/imports/client/interfaces/iwindowed/iwindowed.js';
import '/imports/client/windows/process_action/process_action.js';
import './process_page.html';

Template.processPage.onRendered( function(){
    console.log( 'processPage.onRendered window='+this.data.window );
    this.autorun(() => {
        if( g.run.layout.get() === LYT_WINDOW && g[LYT_WINDOW].taskbar.get()){
            $('.process-page').IWindowed( 'show', 'processWindow' );
        }
    })
});

Template.processPage.helpers({
    windowContext(){
        return {
            gtd: Template.instance().data.gtd
        }
    }
});

Template.processPage.events({
    'ronin.model.thought.action'( ev,instance, action ){
        const thought = Session.get( 'collect.thought' );
        Meteor.call( 'actions.from.thought', thought, action, ( e, res ) => {
            if( e ){
                throwError({ type:e.error, message: e.reason });
                Session.set( 'process.dbope', DBOPE_ERROR );
            } else {
                throwSuccess( 'Action successfully created' );
                Session.set( 'process.dbope', DBOPE_LEAVE );
            }
        });
        return false;
    }
});
