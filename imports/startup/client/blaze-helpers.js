/*
 * /imports/startup/client/blaze-helpers.js
 *
 *  Register global helpers.
 */

// class helper
//  define a topmost class, besides of 'ronin-layout', depending of the runtime
//  detected layout
Template.registerHelper( 'currentLayout', function(){
    const layout = g.run.layout.get();
    return layout === LYT_PAGE ? 'ronin-lyt-page' :
        ( layout === LYT_WINDOW ? 'ronin-lyt-window' : '' );
});

// class helper
Template.registerHelper( 'hideIfPageLayout', function(){
    return g.run.layout.get() === LYT_PAGE ? 'x-hidden':'';
});

// class helper
Template.registerHelper( 'hideIfWindowLayout', function(){
    return g.run.layout.get() === LYT_WINDOW ? 'x-hidden':'';
});

// template helper
Template.registerHelper( 'isPageLayout', function(){
    return g.run.layout.get() === LYT_PAGE;
});

// template helper
Template.registerHelper( 'isWindowLayout', function(){
    return g.run.layout.get() === LYT_WINDOW;
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
