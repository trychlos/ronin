/*
 * 'overview' component.
 *  This is the main component of the overview page.
 *  It is permanently displayed as a general active background.
 */
import { gtd } from '/imports/api/resources/gtd/gtd.js';
import './overview.html';

Template.overview.fn = {
    // Dynamically build the overview/subs label and link
    // These are:
    // - either just the label <p>label</p>
    // - or a 'a' link <a data-router='xxx' href='#'><p>label</p></a>
    //
    routingBegin: function( o,s,route ){
        return route ? "<a href='#'>" : "";
    },
    routingEnd: function( o,s,route ){
        return route ? "</a>" : "";
    },
    routingPara: function( o,s,route ){
        var str = '<p class="ui-corner-all ';
        str += gtd.classesItem( s ).join( ' ' );
        str += '"';
        str += ' data-ronin-gtdid="'+s.id+'"';
        str += '>'+gtd.labelItem( 'overview', s )+'</p>';
        return str;
    }
};

Template.overview.helpers({
    displayH3( item ){
        let html = '';
        const label = gtd.getSubLabelItem( 'overview', item );
        if( label ){
            if( Array.isArray( label )){
                label.forEach( str => {
                    html += '<h3>'+str+'</h3>';
                });
            } else {
                html = '<h3>'+label+'</h3>';
            }
        }
        return html;
    },
    gtdFeatures(){
        return gtd.features();
    },
    gtdLabel( item ){
        return gtd.labelItem( 'overview', item );
    },
    isVisible( item ){
        return gtd.isVisible( 'overview', item );
    },
    // returns the <a href='' id=''></a> link if the subs has a route entry
    //  o: first level of overview
    //  s: second level as subs
    subLink(o,s){
        const fn = Template.overview.fn;
        const route = gtd.routeItem( 'overview', s );
        return fn.routingBegin(o,s,route) + fn.routingPara(o,s,route) + fn.routingEnd(o,s,route);
    }
});

Template.overview.events({
    'click .overview .items'( ev, instance ){
        // target=[object HTMLParagraphElement]
        gtd.activateId( $( ev.target ).attr( 'data-ronin-gtdid' ));
        return false;
    },
});
