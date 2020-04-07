/*
 * /imports/startup/client/blaze-helpers.js
 *
 *  Register global helpers.
 */

// class helper
//  define a topmost class, besides of 'ronin-layout', depending of the runtime
//  detected layout
Template.registerHelper( 'currentLayout', function(){
    const layout = Ronin.ui.runLayout();
    return layout === R_LYT_PAGE ? 'ronin-lyt-page' :
        ( layout === R_LYT_WINDOW ? 'ronin-lyt-window' : '' );
});

// class helper
Template.registerHelper( 'hideIfPageLayout', function(){
    return Ronin.ui.runLayout() === R_LYT_PAGE ? 'x-hidden':'';
});

// class helper
Template.registerHelper( 'hideIfWindowLayout', function(){
    return Ronin.ui.runLayout() === R_LYT_WINDOW ? 'x-hidden':'';
});

// template helper
Template.registerHelper( 'isPageLayout', function(){
    return Ronin.ui.runLayout() === R_LYT_PAGE;
});

// template helper
Template.registerHelper( 'isWindowLayout', function(){
    return Ronin.ui.runLayout() === R_LYT_WINDOW;
});

// template helper
Template.registerHelper( 'pageLayout', function(){
    return R_LYT_PAGE;
});

// template helper
Template.registerHelper( 'windowLayout', function(){
    return R_LYT_WINDOW;
});

// content helper
Template.registerHelper( 'lastUpdated', function( obj ){
    if( obj ){
        if( obj.updatedAt ){
            return 'Last updated on '+moment( obj.updatedAt ).format( 'DD-MM-YYYY H:mm' );
        } else if( obj.createdAt ){
            return 'Created on '+moment( obj.createdAt ).format( 'DD-MM-YYYY H:mm' );
        }
    }
    return '';
});
