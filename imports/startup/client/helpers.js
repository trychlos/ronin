function timeFormat( date, format ){
    return moment(date).format(format);
}

Template.registerHelper(
    'lastUpdated', function( obj ){
        if( obj ){
            if( obj.updatedAt ){
                return 'Last updated on '+timeFormat( obj.updatedAt, "DD-MM-YYYY H:mm" );
            } else if( obj.createdAt ){
                return 'Created on '+timeFormat( obj.createdAt, "DD-MM-YYYY H:mm" );
            }
        }
        return '';
    },
    'timeFormat', function(date, format){
        return timeFormat( date, format );
    },
);
