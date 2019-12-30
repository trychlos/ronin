import { Session } from 'meteor/session';
import './topnav.html';

Template.topnav.fn = {
    // Dynamically build the overview/subs label and link
    // These are:
    // - either just the label <p>label</p>
    // - or a 'a' link <a data-router='xxx' href='#'><p>label</p></a>
    //
    routingBegin: function(o){
        return ( o.router && !ActiveRoute.name( o.router )) ? "<a href='#'>" : "";
    },
    routingEnd: function(o){
        return ( o.router && !ActiveRoute.name( o.router )) ? "</a>" : "";
    },
    routingPara: function(o){
        var str = "<p id='topnav-"+o.id+"'";
        if( o.qualifier ){
            str += " class='"+o.qualifier+"'";
        }
        if( o.router ){
            if( ActiveRoute.name( o.router )){
                str += " class='active'";
            }
            str += " data-router='"+o.router+"'";
        }
        if( o.session ){
            str += " data-sname='"+o.session.name+"'";
            str += " data-svalue='"+o.session.value+"'";
        }
        str += ">"+o.label+"</p>";
        return str;
    }
};

Template.topnav.helpers({
    gtd_topnav(){
        return gtdFeatures();
    },
    is_topnav_visible(o){
        return gtdTopnavIsVisible(o);
    },
    is_subnav_visible(o,s){
        return gtdTopnavIsVisible(s);
    },
    // returns the <a href='' id=''></a> link if the subs has a router entry
    //  o: first level of overview
    //  s: second level as subs
    sub_link(o){
        return Template.topnav.fn.routingBegin(o)
                + Template.topnav.fn.routingPara(o)
                + Template.topnav.fn.routingEnd(o);
    },
});

Template.topnav.events({
    'click .topnav'(event){
        const target = event.target;
        // target=[object HTMLParagraphElement]
        const router = target.dataset.router;
        if( typeof router === 'undefined' ){
            console.log( target.innerText+': router is undefined' );
            return true;
        }
        event.preventDefault();
        const sname = target.dataset.sname;
        const svalue = target.dataset.svalue;
        if( sname && svalue ){
            Session.set( sname, svalue );
            console.log( 'Session.set( '+sname+', '+svalue+' )');
        }
        FlowRouter.go( router );
        return false;
    },
});
