/*
 * 'reviewWindow' window.
 *  This is the main component for projects and actions reviewing.
 */
import '/imports/ui/interfaces/iwindowed/iwindowed.js';
import './review_window.html';

Template.reviewWindow.fn = {
};

Template.reviewWindow.onCreated( function(){
});

Template.reviewWindow.onRendered( function(){
    this.autorun(() => {
        if( g.taskbar.get()){
            $('div.review-window').iWindowed({
                id:    'reviewWindow',
                title: 'Review, organize, do'
            });
        }
    });
});

Template.reviewWindow.helpers({
});
