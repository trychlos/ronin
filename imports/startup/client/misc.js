// Display a modal dialog box
//  Returning true si OK.
miscDialog = function( title, msg, tag ){
    if( !obj ){
        console.log( 'miscParent() specified object is null (tag="'+tag+'")' );
    } else {
        //console.log( 'miscParent() obj='+obj+' tag='+tag );
        var parent = obj;
        const utag = tag.toUpperCase();
        //console.log( 'parent='+parent+' tagName='+parent.tagName+' parent='+parent.parentNode+' tag='+tag );
        while( parent.tagName.toUpperCase() != utag ){
            parent = parent.parentNode;
            //console.log( "new parent="+parent+' tagName='+parent.tagName );
        }
        return parent;
    }
    return null;
};

// rewind the parent hierarchy until finding an object with this tag
// obj is expected to be a DOM element
miscParent = function( obj, tag ){
    if( !obj ){
        console.log( 'miscParent() specified object is null (tag="'+tag+'")' );
    } else {
        //console.log( 'miscParent() obj='+obj+' tag='+tag );
        var parent = obj;
        const utag = tag.toUpperCase();
        //console.log( 'parent='+parent+' tagName='+parent.tagName+' parent='+parent.parentNode+' tag='+tag );
        while( parent.tagName.toUpperCase() != utag ){
            parent = parent.parentNode;
            //console.log( "new parent="+parent+' tagName='+parent.tagName );
        }
        return parent;
    }
    return null;
};

miscSpectrum = function(){
    return {
        color: "#000",
        showInput: true,
        className: "full-spectrum",
        showInitial: true,
        showPalette: true,
        showSelectionPalette: true,
        hideAfterPaletteSelect:false,
        maxSelectionSize: 10,
        preferredFormat: "hex",
        chooseText: "OK",
        cancelText: "Cancel",
        move: function( color ){
        },
        show: function(){
        },
        beforeShow: function(){
        },
        hide: function(){
        },
        change: function(){
        },
        palette: [
            /* gray values */
            [ "#000000", "#1c1c1c", "#383838", "#545454", "#717171", "#8d8d8d", "#aaaaaa", "#c6c6c6", "#e3e3e3", "#ffffff" ],
			/* standard colors */
            [ "#c00000", "#ff0000", "#ffc000", "#ffff00", "#92d050", "#00b050", "#00b0f0", "#0070c0", "#002060", "#7030a0" ],
			/* a full palette */
            [ "#d4dae4", "#ffcdd2", "#f9e6ad", "#bce4ce", "#bdf0e9", "#b3e5fc", "#aec1ff", "#c5c0da", "#d6bdcc", "#d2c5c1" ],
            [ "#b0b8cd", "#fe9998", "#f4d679", "#90d2af", "#92e7dc", "#81d4fa", "#88a3f9", "#9f97c1", "#c492ac", "#b4a09a" ],
            [ "#949db1", "#f35c4e", "#edb90f", "#33b579", "#02d7c5", "#29b6f6", "#5874cd", "#7e6bad", "#a9537c", "#826358" ],
            /*[ "#727a8c", "#e94633", "#eaa100", "#36955f", "#11b3a5", "#039be5", "#2349ae", "#584a8f", "#963a64", "#624339" ],*/
            [ "#5e6677", "#d73c2d", "#ea8f00", "#247346", "#018b80", "#0288d1", "#163fa2", "#4f4083", "#81355a", "#5d4037" ],
            /*[ "#3f4757", "#ca3626", "#ea7e00", "#1d5b38", "#026b60", "#0277bd", "#083596", "#473776", "#6e3051", "#4e342e" ],*/
            [ "#1d2534", "#bb2b1a", "#ea5d00", "#17492d", "#024f43", "#01579b", "#002381", "#3a265f", "#4c2640", "#3e2723" ]
        ]
    };
};

$.datepicker.setDefaults({
    showOn: "both",
    buttonText: '<span class="fas fa-calendar-alt x-font"></span>',
    dateFormat: 'dd/mm/yy',
    autoSize: true,
    showWeek: true,
    firstDay: 1,
    duration: 'fast'
});
