/*
 * 'overview' component.
 *  This is the main component of the overview page.
 *  It is permanently displayed as a general active background.
 */
import { gtd } from '/imports/ui/interfaces/gtd/gtd.js';
import './overview.html';

Template.overview.fn = {
    // Dynamically build the overview/subs label and link
    // These are:
    // - either just the label <p>label</p>
    // - or a 'a' link <a data-router='xxx' href='#'><p>label</p></a>
    //
    routingBegin: function( o,s ){
        return s.router ? "<a href='#'>" : "";
    },
    routingEnd: function( o,s ){
        return s.router ? "</a>" : "";
    },
    routingPara: function( o,s ){
        var str = "<p class='ui-corner-all";
        if( s.qualifier ){
            str += " "+s.qualifier;
        }
        str += "'";
        if( s.router ){
            str += " data-router='"+s.router+"'";
        }
        str += ">"+s.label+"</p>";
        return str;
    }
};

Template.overview.helpers({
    displayH3( item ){
        let html = '';
        if( item.h3 ){
            if( Array.isArray( item.h3 )){
                item.h3.forEach( label => {
                    html += '<h3>'+label+'</h3>';
                });
            } else {
                html = '<h3>'+item.h3+'</h3>';
            }
        }
        return html;
    },
    gtdFeatures(){
        return gtd.features();
    },
    isVisible( type, item ){
        return gtd.isVisible( type, item );
    },
    // returns the <a href='' id=''></a> link if the subs has a router entry
    //  o: first level of overview
    //  s: second level as subs
    subLink(o,s){
        return Template.overview.fn.routingBegin(o,s)
            + Template.overview.fn.routingPara(o,s)
            + Template.overview.fn.routingEnd(o,s);
    }
});

Template.overview.events({
    'click .overview .items'(event){
        const target = event.target;
        // target=[object HTMLParagraphElement]
        const router = target.dataset.router;
        if( typeof router === 'undefined' ){
            console.log( 'router is undefined' );
            return true;
        }
        event.preventDefault();
        FlowRouter.go( router );
        return false;
    },
});
